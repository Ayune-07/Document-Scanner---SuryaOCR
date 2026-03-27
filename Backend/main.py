from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import uvicorn
import io
import os
import tempfile
from ocr_service import OCRService

app = FastAPI(title="SuryaOCR Document Scanner API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ocr_service = OCRService()

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".pdf"}
MAX_FILE_SIZE_MB = 50


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": "surya-ocr"}


@app.post("/api/scan")
async def scan_document(file: UploadFile = File(...)):
    """
    Accepts an image (JPG/PNG) or PDF (including multi-page).
    Returns per-page OCR results with text and bounding boxes.
    """
    ext = os.path.splitext(file.filename or "")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    content = await file.read()
    size_mb = len(content) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(
            status_code=413,
            detail=f"File too large ({size_mb:.1f} MB). Max allowed: {MAX_FILE_SIZE_MB} MB."
        )

    try:
        results = ocr_service.process(content, ext, file.filename)
        return {
            "filename": file.filename,
            "total_pages": len(results),
            "pages": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR processing failed: {str(e)}")


@app.post("/api/export/txt")
async def export_txt(payload: dict):
    """
    Accepts the scan result payload and returns a plain .txt file.
    """
    try:
        pages = payload.get("pages", [])
        filename = payload.get("filename", "document")
        lines = []
        for i, page in enumerate(pages, 1):
            if len(pages) > 1:
                lines.append(f"--- Page {i} ---\n")
            for block in page.get("blocks", []):
                lines.append(block.get("text", "") + "\n")
            lines.append("\n")

        txt_content = "".join(lines).strip()
        base_name = os.path.splitext(filename)[0]
        return Response(
            content=txt_content.encode("utf-8"),
            media_type="text/plain",
            headers={"Content-Disposition": f'attachment; filename="{base_name}.txt"'}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)