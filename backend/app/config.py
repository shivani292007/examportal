import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Resistant Skill Assessment Portal"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secure-assessment-secret-key-2026-auth-jwt-xyz")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Defaults to local SQLite, but easily swapped to MySQL:
    # Example: "mysql+pymysql://root:password@localhost:3306/skill_assessment_db"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./assessment.db")
    
    TOTAL_EXAM_TIME_SECONDS: int = 90 * 60  # 90 minutes total
    SECTION_TIMES_SECONDS: dict = {
        "aptitude": 20 * 60,
        "programming": 30 * 60,
        "debugging": 20 * 60,
        "technical_mcq": 15 * 60,
        "output_prediction": 15 * 60,
        "short_answer": 15 * 60
    }
    
    MAX_INTEGRITY_STRIKES: int = 3

    ALLOWED_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
