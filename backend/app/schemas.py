from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class StudentRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    college: Optional[str] = None
    roll_number: Optional[str] = None
    target_domain: Optional[str] = "Python"

class StudentLogin(BaseModel):
    email: EmailStr
    password: str

class StudentOut(BaseModel):
    id: int
    name: str
    email: str
    college: Optional[str] = None
    roll_number: Optional[str] = None
    target_domain: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    student: StudentOut

class TokenData(BaseModel):
    student_id: Optional[int] = None
    email: Optional[str] = None

# --- Question Schemas ---
class TestCasePublic(BaseModel):
    input: str
    expected: str

class QuestionPublic(BaseModel):
    id: int
    section: str
    domain: str
    title: str
    description: str
    code_template: Optional[str] = None
    faulty_code: Optional[str] = None
    expected_output: Optional[str] = None
    options: Optional[List[str]] = None
    sample_test_cases: Optional[List[TestCasePublic]] = None
    skill_tag: str
    topic: str
    difficulty: str
    marks: int

# --- Session & Assessment Schemas ---
class AssessmentStartRequest(BaseModel):
    domain: str = "Python"

class AnswerPayload(BaseModel):
    question_id: int
    selected_option: Optional[str] = None
    code_submission: Optional[str] = None
    language: Optional[str] = None
    text_response: Optional[str] = None

class AutoSaveRequest(BaseModel):
    session_id: str
    current_section: str
    time_remaining_seconds: int
    answers: List[AnswerPayload]

class AutoSaveResponse(BaseModel):
    status: str = "success"
    saved_count: int
    timestamp: datetime

class AssessmentSessionOut(BaseModel):
    session_id: str
    student_name: str
    student_email: str
    domain: str
    status: str
    total_duration_seconds: int
    time_remaining_seconds: int
    current_section: str
    strike_count: int
    questions: Dict[str, List[QuestionPublic]]
    saved_answers: Dict[int, Dict[str, Any]]

# --- Code Runner Schemas ---
class CodeRunRequest(BaseModel):
    language: str
    code: str
    custom_input: Optional[str] = ""
    question_id: Optional[int] = None

class TestCaseResult(BaseModel):
    test_case_index: int
    input: str
    expected: str
    actual: str
    passed: bool
    execution_time_ms: float
    error: Optional[str] = None

class CodeRunResponse(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    execution_time_ms: float
    test_results: Optional[List[TestCaseResult]] = None
    all_passed: Optional[bool] = None

# --- Integrity Schemas ---
class IntegrityEventCreate(BaseModel):
    session_id: str
    event_type: str
    details: Optional[str] = None
    severity: Optional[str] = "warning"

class IntegrityStatusOut(BaseModel):
    session_id: str
    strike_count: int
    max_strikes: int = 3
    is_terminated: bool
    total_violations: int
    events_summary: Dict[str, int]
    recent_events: List[Dict[str, Any]]

# --- Submission & Results Schemas ---
class AssessmentSubmitRequest(BaseModel):
    session_id: str
    final_answers: Optional[List[AnswerPayload]] = None

class SectionScoreDetail(BaseModel):
    section: str
    score: float
    max_score: float
    percentage: float
    questions_count: int
    correct_count: int

class SkillScoreDetail(BaseModel):
    skill: str
    score_percentage: float
    level: str # Master, Advanced, Intermediate, Beginner
    category: str

class PlacementOpportunity(BaseModel):
    role_title: str
    company_type: str
    required_skills: List[str]
    match_percentage: float
    recommendation_note: str

class AssessmentResultOut(BaseModel):
    session_id: str
    student_name: str
    domain: str
    overall_score: float
    max_score: float
    percentage: float
    candidate_level: str # 'Beginner', 'Intermediate', 'Advanced', 'Expert / Industry-Ready'
    candidate_level_description: str
    next_milestone_recommendation: str
    performance_band: str
    section_scores: Dict[str, SectionScoreDetail]
    skill_scores: Dict[str, float]
    skill_details: List[SkillScoreDetail]
    strong_skills: List[str]
    weak_skills: List[str]
    skill_gaps: List[str]
    career_recommendations: List[PlacementOpportunity]
    integrity_summary: Dict[str, Any]
    submitted_at: datetime
