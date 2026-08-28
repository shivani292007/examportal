from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student
from app.schemas import StudentRegister, StudentLogin, StudentOut, Token
from app.auth import get_password_hash, verify_password, create_access_token, get_current_student

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_student(payload: StudentRegister, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student with this email is already registered."
        )
    
    hashed_pwd = get_password_hash(payload.password)
    student = Student(
        name=payload.name,
        email=payload.email,
        hashed_password=hashed_pwd,
        college=payload.college,
        roll_number=payload.roll_number,
        target_domain=payload.target_domain or "Python"
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    access_token = create_access_token(data={"sub": student.id, "email": student.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "student": student
    }

@router.post("/login", response_model=Token)
def login_student(payload: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == payload.email).first()
    if not student or not verify_password(payload.password, student.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    access_token = create_access_token(data={"sub": student.id, "email": student.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "student": student
    }

@router.get("/me", response_model=StudentOut)
def get_current_profile(current_student: Student = Depends(get_current_student)):
    return current_student
