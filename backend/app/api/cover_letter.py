from fastapi import APIRouter, HTTPException, Depends, status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.cover_letter import CoverLetter
from app.models.resume_analysis import ResumeAnalysis
from app.schemas.cover_letter import CoverLetterCreate, CoverLetterResponse
from app.services.openai_service import generate_cover_letter_with_ai
from app.utils.file_parser import extract_text_from_docx,extract_text_from_pdf

router = APIRouter(prefix="/api/cover-letter", tags=["cover-letter"])

@router.post("/generate", response_model=CoverLetterResponse, status_code=status.HTTP_201_CREATED)
def generate_cover_letter(user_id: int, cover_letter_data: CoverLetterCreate, db: Session = Depends(get_db)):
    resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == cover_letter_data.resume_id, ResumeAnalysis.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    if resume.filename.endswith('.pdf'):
        resume_text = extract_text_from_pdf(resume.file_path)
    else:
        resume_text = extract_text_from_docx(resume.file_path)

    cover_letter_text = generate_cover_letter_with_ai(resume_text=resume_text, job_title=cover_letter_data.job_title, company_name=cover_letter_data.company_name, job_description=cover_letter_data.job_description)
    cover_letter = CoverLetter(user_id=user_id, resume_id=cover_letter_data.resume_id, job_title=cover_letter_data.job_title, company_name=cover_letter_data.company_name, cover_letter_text=cover_letter_text)
    
    db.add(cover_letter)
    db.commit()
    db.refresh(cover_letter)

    return cover_letter
    
    