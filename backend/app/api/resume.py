from fastapi import APIRouter, File, UploadFile, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.models.resume_analysis import ResumeAnalysis
from app.schemas.resume import ResumeAnalysisResponse
from app.models.user import User
from app.utils.file_parser import extract_text_from_pdf, extract_text_from_docx
from app.services.openai_service import analyze_resume_with_ai
from app.db.database import get_db
from pathlib import Path
import shutil
import os

router = APIRouter(prefix="/api/resume", tags=["resume"])



@router.post("/upload", response_model=ResumeAnalysisResponse, status_code=status.HTTP_201_CREATED)
def upload_resume(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if (not file.filename.endswith(".pdf") and not file.filename.endswith(".docx")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File doesn't end in .pdf or .docx"
        )
    upload_dir = Path(f"uploads/user_{user_id}/")
    upload_dir.mkdir(parents=True, exist_ok=True)
    file_path = Path(upload_dir / file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    if file.filename.endswith(".pdf"):
        resume_text = extract_text_from_pdf(str(file_path))
    if file.filename.endswith(".docx"):
        resume_text = extract_text_from_docx(str(file_path))
    analysis = analyze_resume_with_ai(resume_text)
    resume_analysis = ResumeAnalysis (
        user_id = user_id,
        filename = file.filename,
        file_path = str(file_path),
        overall_score = analysis["overall_score"],
        analysis_text = analysis["analysis_text"],
        suggestions = analysis["suggestions"]
    )
    db.add(resume_analysis)
    db.commit()
    db.refresh(resume_analysis)
    return resume_analysis
    