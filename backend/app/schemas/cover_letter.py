from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class CoverLetterCreate(BaseModel):
    job_title: str
    company_name: str
    job_description: str
    resume_id: int

class CoverLetterResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    job_title: str
    company_name: str
    cover_letter_text: str
    created_at: datetime
    class Config:
        from_attributes = True