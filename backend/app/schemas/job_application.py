from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional, Any

class JobApplicationCreate(BaseModel):
    company_name: str
    job_title: str
    job_url: Optional[str] = None
    status: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    application_date: date
    notes: Optional[str] = None
    
class JobApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    job_title: Optional[str] = None
    job_url: Optional[str] = None
    status: Optional[str] = None
    location: Optional[str] = None
    salary_range: Optional[str] = None
    application_date: Optional[date] = None
    notes: Optional[str] = None

class JobApplicationResponse(BaseModel):
    id: int
    user_id: int
    company_name: str
    job_title: str
    job_url: Optional[str] = None
    status: str
    location: Optional[str] = None
    salary_range: Optional[str] = None
    application_date: date
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    class Config():
        from_attributes = True
