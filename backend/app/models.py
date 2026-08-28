from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    college = Column(String(150), nullable=True)
    roll_number = Column(String(50), nullable=True)
    target_domain = Column(String(50), default="Python")
    created_at = Column(DateTime, default=func.now())

    sessions = relationship("AssessmentSession", back_populates="student", cascade="all, delete-orphan")
    results = relationship("AssessmentResult", back_populates="student", cascade="all, delete-orphan")


class AssessmentSession(Base):
    __tablename__ = "assessment_sessions"

    id = Column(String(36), primary_key=True, index=True) # UUID
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    domain = Column(String(50), nullable=False)
    status = Column(String(30), default="in_progress") # in_progress, submitted, terminated
    start_time = Column(DateTime, default=func.now())
    end_time = Column(DateTime, nullable=True)
    total_duration_seconds = Column(Integer, default=5400)
    time_remaining_seconds = Column(Integer, default=5400)
    current_section = Column(String(50), default="aptitude")
    strike_count = Column(Integer, default=0)
    overall_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=func.now())

    student = relationship("Student", back_populates="sessions")
    answers = relationship("StudentAnswer", back_populates="session", cascade="all, delete-orphan")
    integrity_events = relationship("IntegrityEvent", back_populates="session", cascade="all, delete-orphan")
    result = relationship("AssessmentResult", back_populates="session", uselist=False)


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    section = Column(String(50), index=True, nullable=False) # aptitude, programming, debugging, technical_mcq, output_prediction, short_answer
    domain = Column(String(50), index=True, default="common") # common, Python, Java, JavaScript, SQL, DSA
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    code_template = Column(Text, nullable=True)
    faulty_code = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    options_json = Column(Text, nullable=True) # JSON list
    correct_answer = Column(Text, nullable=True) # Secret answer key (never sent to client)
    test_cases_json = Column(Text, nullable=True) # JSON list of {input, expected, hidden}
    skill_tag = Column(String(100), nullable=False)
    topic = Column(String(100), nullable=False)
    difficulty = Column(String(20), default="Medium")
    marks = Column(Integer, default=10)


class StudentAnswer(Base):
    __tablename__ = "student_answers"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(36), ForeignKey("assessment_sessions.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    selected_option = Column(String(255), nullable=True)
    code_submission = Column(Text, nullable=True)
    language = Column(String(30), nullable=True)
    text_response = Column(Text, nullable=True)
    is_evaluated = Column(Boolean, default=False)
    is_correct = Column(Boolean, default=False)
    marks_obtained = Column(Float, default=0.0)
    test_results_json = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    session = relationship("AssessmentSession", back_populates="answers")
    question = relationship("Question")


class IntegrityEvent(Base):
    __tablename__ = "integrity_events"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(36), ForeignKey("assessment_sessions.id"), nullable=False)
    event_type = Column(String(50), nullable=False) # tab_switch, fullscreen_exit, copy_attempt, paste_attempt, cut_attempt, restricted_key, devtools_detected, context_menu
    details = Column(Text, nullable=True)
    severity = Column(String(20), default="warning") # info, warning, violation, critical
    timestamp = Column(DateTime, default=func.now())

    session = relationship("AssessmentSession", back_populates="integrity_events")


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id = Column(String(36), ForeignKey("assessment_sessions.id"), unique=True, nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    overall_score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    section_scores_json = Column(Text, nullable=False)
    skill_scores_json = Column(Text, nullable=False)
    strong_skills_json = Column(Text, nullable=False)
    weak_skills_json = Column(Text, nullable=False)
    skill_gaps_json = Column(Text, nullable=False)
    recommendations_json = Column(Text, nullable=False)
    submitted_at = Column(DateTime, default=func.now())

    student = relationship("Student", back_populates="results")
    session = relationship("AssessmentSession", back_populates="result")
