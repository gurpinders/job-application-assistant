from fastapi import APIRouter, HTTPException, Depends, status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.job_match import JobMatch
from app.models.resume_analysis import ResumeAnalysis
from app.schemas.job_match import JobMatchCreate, JobMatchResponse
from app.services.openai_service import analyze_job_match_with_ai
from app.utils.file_parser import extract_text_from_pdf, extract_text_from_docx

router = APIRouter(
    prefix="/api/job-match",
    tags=["job-match"]
)

@router.post("/analyze", response_model=JobMatchResponse, status_code=status.HTTP_201_CREATED)
def analyze_job_match(user_id: int, job_match_data: JobMatchCreate, db: Session = Depends(get_db)):
    # 1. Fetch resume
    resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == job_match_data.resume_id, ResumeAnalysis.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )
    if resume.filename.endswith('.pdf'):
        resume_text = extract_text_from_pdf(resume.file_path)
    else:
        resume_text = extract_text_from_docx(resume.file_path)

    match_data = analyze_job_match_with_ai(resume_text=resume_text, job_description=job_match_data.job_description)

    job_match = JobMatch(
    user_id=user_id,
    resume_id=job_match_data.resume_id,
    job_description=job_match_data.job_description,
    match_percentage=match_data["match_percentage"],
    matching_skills=match_data["matching_skills"],
    missing_skills=match_data["missing_skills"],
    suggestions=match_data["suggestions"]
    )

    db.add(job_match)
    db.commit()
    db.refresh(job_match)

    return job_match
    