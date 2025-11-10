from fastapi import APIRouter, HTTPException, Depends, status
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.models.resume_analysis import ResumeAnalysis
from app.models.ats_check import ATSCheck
from app.schemas.ats_check import ATSCheckCreate, ATSCheckResponse
from app.services.openai_service import check_ats_compatibility_with_ai
from app.utils.file_parser import extract_text_from_pdf, extract_text_from_docx

router = APIRouter(
    prefix="/api/ats-check",
    tags=["ats-check"]
)


@router.post("/check", response_model=ATSCheckResponse, status_code=status.HTTP_201_CREATED)
def check_ats(user_id: int, ats_check_data: ATSCheckCreate, db: Session = Depends(get_db)):
    resume = db.query(ResumeAnalysis).filter(ResumeAnalysis.id ==
                                             ats_check_data.resume_id, ResumeAnalysis.user_id == user_id).first()
    if not resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Resume not found"
        )

    if resume.filename.endswith('.pdf'):
        resume_text = extract_text_from_pdf(resume.file_path)
    else:
        resume_text = extract_text_from_docx(resume.file_path)

    ats_data = check_ats_compatibility_with_ai(resume_text=resume_text)

    ats_check = ATSCheck(
        user_id=user_id,
        resume_id=ats_check_data.resume_id,
        ats_score=ats_data["ats_score"],
        issues_found=ats_data["issues_found"],
        recommendations=ats_data["recommendations"],
        is_ats_friendly=ats_data["is_ats_friendly"]
    )

    db.add(ats_check)
    db.commit()
    db.refresh(ats_check)

    return ats_check
