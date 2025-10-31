from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from sqlalchemy import text
from app.api.auth import router as auth_router
from app.api.resume import router as resume_router


app = FastAPI(title="Job Application Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
