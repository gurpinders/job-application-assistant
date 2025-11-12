from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Date
from sqlalchemy.sql import func
from app.db.database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    company_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_url = Column(String, nullable=True)
    status = Column(String, nullable=False)
    location = Column(String, nullable=True)
    salary_range = Column(String, nullable=True)
    application_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    