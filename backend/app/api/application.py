from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.job_application import JobApplication
from app.schemas.job_application import JobApplicationCreate, JobApplicationUpdate, JobApplicationResponse
from typing import List

router = APIRouter(
    prefix="/api/applications",
    tags=["applications"]
)

@router.post("", response_model=JobApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    user_id: int,
    application: JobApplicationCreate,
    db: Session = Depends(get_db)
):
    # Create new application
    new_application = JobApplication(
        user_id=user_id,
        company_name=application.company_name,
        job_title=application.job_title,
        job_url=application.job_url,
        status=application.status,
        location=application.location,
        salary_range=application.salary_range,
        application_date=application.application_date,
        notes=application.notes
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    return new_application

@router.get("/user/{user_id}", response_model=List[JobApplicationResponse])
def get_user_applications(user_id: int, db: Session = Depends(get_db)):
    applications = db.query(JobApplication).filter(
        JobApplication.user_id == user_id
    ).order_by(JobApplication.created_at.desc()).all()
    
    return applications

@router.get("/{application_id}", response_model=JobApplicationResponse)
def get_application(application_id: int, user_id: int, db: Session = Depends(get_db)):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == user_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    return application

@router.put("/{application_id}", response_model=JobApplicationResponse)
def update_application(
    application_id: int,
    user_id: int,
    application_data: JobApplicationUpdate,
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == user_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Update only provided fields
    update_data = application_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(application, field, value)
    
    db.commit()
    db.refresh(application)
    
    return application

@router.patch("/{application_id}/status", response_model=JobApplicationResponse)
def update_application_status(
    application_id: int,
    user_id: int,
    status_value: str,
    db: Session = Depends(get_db)
):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == user_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    # Validate status
    valid_statuses = ["Applied", "Interview", "Offer", "Rejected"]
    if status_value not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    application.status = status_value
    db.commit()
    db.refresh(application)
    
    return application

@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, user_id: int, db: Session = Depends(get_db)):
    application = db.query(JobApplication).filter(
        JobApplication.id == application_id,
        JobApplication.user_id == user_id
    ).first()
    
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found"
        )
    
    db.delete(application)
    db.commit()
    
    return None