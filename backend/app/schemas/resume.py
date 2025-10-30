from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class ResumeAnalysisResponse(BaseModel):
    id: int
    user_id: int
    filename: str
    file_path: str 
    overall_score: Optional[int]
    analysis_text: Optional[str]
    suggestions: Optional[Any]
    created_at: datetime 
    class Config:
        from_attributes = True
