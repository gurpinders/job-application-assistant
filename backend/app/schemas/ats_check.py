from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class ATSCheckCreate(BaseModel):
    resume_id: int

class ATSCheckResponse(BaseModel):
    id: int
    user_id: int
    resume_id: int
    ats_score: int
    issues_found: list[str]
    recommendations: list[str]
    is_ats_friendly: bool
    created_at: datetime
    class Config():
        from_attributes = True