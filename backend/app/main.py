from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from sqlalchemy import text
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router
from app.api.cover_letter import router as cover_letter_router
from app.api.job_match import router as job_match_router
from app.api.ats_check import router as ats_check_router
from app.api.application import router as application_router


app = FastAPI(title="Job Application Assistant API")

origins = [
    "https://job-application-assistant-three.vercel.app/",
    "https://job-application-assistant-nc2qmpvam.vercel.app",
    "http://localhost:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "message": "Job Application Assistant API",
        "status": "running"
    }

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(cover_letter_router)
app.include_router(job_match_router)
app.include_router(ats_check_router)
app.include_router(application_router)


@app.get("/api/test-db")
async def test_database():
    """
    Test database connection
    """
    try:
        # Try to execute a simple query
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]

        return {
            "status": "success",
            "message": "Database connected successfully!",
            "postgres_version": version
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }
# Force redeploy

