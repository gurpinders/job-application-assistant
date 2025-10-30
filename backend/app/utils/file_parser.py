from PyPDF2 import PdfReader
from docx import Document
from pathlib import Path

def extract_text_from_pdf(file_path:str) -> str:
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text()
    return text

def extract_text_from_docx(file_path:str) -> str:
    document = Document(file_path)
    text = ""
    for paragraph in document.paragraphs:
        text += "\n" + paragraph.text
    return text