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


@router.get("/analytics/{user_id}")
def get_application_analytics(user_id: int, db: Session = Depends(get_db)):
    # 1. Query all applications for this user
    applications = db.query(JobApplication).filter(
        JobApplication.user_id == user_id).all()

    # 2. Calculate total count
    total = len(applications)

    # 3. Count by status (hint: use a loop or list comprehension)
    applied_count = len([app for app in applications if app.status == "Applied"])
    interview_count = len([app for app in applications if app.status == "Interview"])
    offer_count = len([app for app in applications if app.status == "Offer"])
    rejected_count = len([app for app in applications if app.status == "Rejected"])

    # 4. Calculate percentages (handle division by zero!)
    if total == 0:
        applied_percentage = 0
        interview_percentage = 0
        offer_percentage = 0
        rejected_percentage = 0
    else:
        applied_percentage = (applied_count / total) * 100
        interview_percentage = (interview_count / total) * 100
        offer_percentage = (offer_count / total) * 100
        rejected_percentage = (rejected_count / total) * 100
    # 5. Return as a dictionary
    return {
        "total": total,
        "applied": {"count": applied_count, "percentage": applied_percentage},
        "interview": {"count": interview_count, "percentage": interview_percentage},
        "offer": {"count": offer_count, "percentage": offer_percentage},
        "rejected": {"count": rejected_count, "percentage": rejected_percentage}
    }
