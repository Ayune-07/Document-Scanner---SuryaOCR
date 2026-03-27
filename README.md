# 📄 Document Scanner with OCR (SuryaOCR)

A full-stack document scanning system that captures, processes, and extracts text from images using Optical Character Recognition (OCR). This project integrates a modern React frontend with a Python-based backend to deliver efficient and accurate document digitization.

---

## 🚀 Features

* 📷 Upload and scan document images
* 🧠 OCR-based text extraction
* 🖼️ Image preprocessing (noise reduction, thresholding)
* ⚡ Fast and responsive frontend (Vite + React)
* 🔗 Backend API for processing images
* 📄 Clean display of extracted text

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* HTML, CSS, JavaScript

### Backend

* Python
* FastAPI / Flask (update depending on your setup)
* OpenCV
* PyTorch

---

## 📂 Project Structure

```bash
DocumentScanner/
│
├── Backend/
│   ├── main.py
│   ├── ocr_service.py
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/Ayune-07/Document-Scanner---SuryaOCR.git
cd DocumentScanner
```

---

### 2. Backend Setup

```bash
cd Backend
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Run backend:

```bash
python main.py
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📸 System Workflow

1. User uploads a document image
2. Frontend sends the image to the backend
3. Backend preprocesses the image
4. OCR extracts text using trained models
5. Extracted text is returned and displayed

---

## 🎯 Applications

* ID and document scanning systems
* Automated data entry
* Academic research projects
* Business document digitization

---

## ⚠️ Notes

* Large folders like `.venv` and `node_modules` are excluded via `.gitignore`
* OCR accuracy depends on image clarity and lighting conditions
* Ensure Python and Node.js are properly installed

---

## 🔮 Future Improvements

* 📱 Mobile camera integration
* 🌐 Cloud-based processing
* 🔍 Multi-language OCR support
* 🧾 Structured data extraction (IDs, forms)

---

## 👨‍💻 Author

* Nhiel Montellano
* GitHub: https://github.com/Ayune-07

---

## 📄 License

This project is developed for academic and educational purposes.
