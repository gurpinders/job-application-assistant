from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class JobMatchCreate(BaseModel):
    job_description: str
    resume_id: int

class JobMatchResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    job_description: str
    match_percentage: int
    matching_skills: list[str]
    missing_skills: list[str]
    suggestions: list[str]
    created_at: datetime
    class Config():
        from_attributes = True
    
    