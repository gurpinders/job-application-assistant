from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.core.security import hash_password, verify_password, create_access_token
from app.db.database import get_db

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)) -> UserResponse:
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Email is already registered"
        )
    hashed_password = hash_password(user.password)
    db_user = User(
        full_name=user.full_name,
        email=user.email, 
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)) -> dict:
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid email or password")
    access_token = create_access_token(data = {"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }
