from sqlalchemy import Column, Integer, ForeignKey, DateTime, JSON, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class ATSCheck(Base):
    __tablename__ = "ats_checks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    resume_id  = Column(Integer, ForeignKey("resume_analyses.id"), nullable=False, index=True)
    ats_score = Column(Integer, nullable=False)
    issues_found = Column(JSON, nullable=False)
    recommendations = Column(JSON, nullable=False) 
    is_ats_friendly = Column(Boolean, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())