from __future__ import annotations
import base64
import io
from typing import List, Dict, Any
from PIL import Image


# Import the stable Predictor classes
from surya.recognition import RecognitionPredictor, FoundationPredictor
from surya.detection import DetectionPredictor


def _pdf_to_images(content: bytes) -> List[Image.Image]:
    try:
        from pdf2image import convert_from_bytes
    except ImportError as e:
        raise RuntimeError("pdf2image is required. Install: pip install pdf2image") from e
    
    POPPLER_PATH = r"C:\Program Files\poppler\poppler-25.12.0\Library\bin"
    return convert_from_bytes(content, dpi=200, poppler_path=POPPLER_PATH)


def _normalize_bbox(bbox, img_width: int, img_height: int) -> Dict[str, float]:
    x1, y1, x2, y2 = bbox
    return {
        "x": x1 / img_width,
        "y": y1 / img_height,
        "width": (x2 - x1) / img_width,
        "height": (y2 - y1) / img_height,
        "px_x1": x1,
        "px_y1": y1,
        "px_x2": x2,
        "px_y2": y2,
    }


class OCRService:
    def __init__(self):
        print("Loading SuryaOCR models...")
        # 1. Initialize predictors
        self.doc_foundation = FoundationPredictor()
        self.rec_predictor = RecognitionPredictor(self.doc_foundation)
        self.det_predictor = DetectionPredictor()
        print("SuryaOCR models loaded successfully.")

    def _run_ocr_on_image(self, image: Image.Image) -> Dict[str, Any]:
        if image.mode != "RGB":
            image = image.convert("RGB")
        img_w, img_h = image.size
        predictions = self.rec_predictor([image], det_predictor=self.det_predictor)
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG", quality = 85)
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        text_lines = predictions[0].text_lines
        blocks: List[Dict[str, Any]] = []
        full_text_lines: List[str] = []

        for text_line in text_lines:
            text = text_line.text.strip()
            if not text:
                continue
            
            bbox = _normalize_bbox(text_line.bbox, img_w, img_h)
            blocks.append({
                "text": text,
                "confidence": round(text_line.confidence, 4),
                "bbox": bbox,
            })
            full_text_lines.append(text)

        return {
            "width": img_w,
            "height": img_h,
            "full_text": "\n".join(full_text_lines),
            "blocks": blocks,
            "image": f"data:image/jpeg;base64,{img_base64}"
        }

    def process(self, content: bytes, ext: str, filename: str) -> List[Dict[str, Any]]:
        if ext == ".pdf":
            images = _pdf_to_images(content)
        else:
            images = [Image.open(io.BytesIO(content))]
        return [self._run_ocr_on_image(img) for img in images]