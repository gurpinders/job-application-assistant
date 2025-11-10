from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON
from sqlalchemy.sql import func
from app.db.database import Base

class JobMatch(Base):
    __tablename__ = "job_matches"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    resume_id  = Column(Integer, ForeignKey("resume_analyses.id"), nullable=False, index=True)
    job_description = Column(Text, nullable=False)
    match_percentage = Column(Integer, nullable=False)
    matching_skills = Column(JSON, nullable=False)
    missing_skills = Column(JSON, nullable=False)
    suggestions = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())