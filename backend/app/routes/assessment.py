import uuid
import json
import random
from datetime import datetime
from typing import Dict, List, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student, AssessmentSession, Question, StudentAnswer, IntegrityEvent, AssessmentResult
from app.schemas import (
    AssessmentStartRequest, AssessmentSessionOut, QuestionPublic, TestCasePublic,
    AutoSaveRequest, AutoSaveResponse, AssessmentSubmitRequest, AssessmentResultOut
)
from app.auth import get_current_student
from app.config import settings

router = APIRouter(prefix="/assessment", tags=["Assessment Engine"])

def build_public_question(q: Question) -> QuestionPublic:
    options = None
    if q.options_json:
        try:
            options = json.loads(q.options_json)
            shuffled_options = list(options)
            random.shuffle(shuffled_options)
            options = shuffled_options
        except Exception:
            options = []

    sample_test_cases = None
    if q.test_cases_json:
        try:
            all_tc = json.loads(q.test_cases_json)
            sample_test_cases = [
                TestCasePublic(input=tc.get("input", ""), expected=tc.get("expected", ""))
                for tc in all_tc if not tc.get("hidden", False)
            ]
        except Exception:
            sample_test_cases = []

    return QuestionPublic(
        id=q.id,
        section=q.section,
        domain=q.domain,
        title=q.title,
        description=q.description,
        code_template=q.code_template,
        faulty_code=q.faulty_code,
        expected_output=q.expected_output,
        options=options,
        sample_test_cases=sample_test_cases,
        skill_tag=q.skill_tag,
        topic=q.topic,
        difficulty=q.difficulty,
        marks=q.marks
    )


@router.post("/start", response_model=AssessmentSessionOut)
def start_assessment(
    payload: AssessmentStartRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    active_session = db.query(AssessmentSession).filter(
        AssessmentSession.student_id == current_student.id,
        AssessmentSession.status == "in_progress"
    ).first()

    if active_session:
        session_id = active_session.id
    else:
        session_id = str(uuid.uuid4())
        active_session = AssessmentSession(
            id=session_id,
            student_id=current_student.id,
            domain=payload.domain or current_student.target_domain or "Python",
            status="in_progress",
            total_duration_seconds=settings.TOTAL_EXAM_TIME_SECONDS,
            time_remaining_seconds=settings.TOTAL_EXAM_TIME_SECONDS,
            current_section="aptitude",
            strike_count=0
        )
        db.add(active_session)
        db.commit()
        db.refresh(active_session)

    domain = active_session.domain
    all_questions = db.query(Question).filter(
        (Question.domain == "common") | (Question.domain == domain)
    ).all()

    sections_order = ["aptitude", "programming", "debugging", "technical_mcq", "output_prediction", "short_answer"]
    grouped_questions: Dict[str, List[QuestionPublic]] = {sec: [] for sec in sections_order}

    for q in all_questions:
        if q.section in grouped_questions:
            grouped_questions[q.section].append(build_public_question(q))

    for sec in grouped_questions:
        random.shuffle(grouped_questions[sec])

    saved_answers_records = db.query(StudentAnswer).filter(StudentAnswer.session_id == active_session.id).all()
    saved_answers: Dict[int, Dict[str, Any]] = {}
    for sa in saved_answers_records:
        saved_answers[sa.question_id] = {
            "selected_option": sa.selected_option,
            "code_submission": sa.code_submission,
            "text_response": sa.text_response,
            "language": sa.language
        }

    return AssessmentSessionOut(
        session_id=active_session.id,
        student_name=current_student.name,
        student_email=current_student.email,
        domain=active_session.domain,
        status=active_session.status,
        total_duration_seconds=active_session.total_duration_seconds,
        time_remaining_seconds=active_session.time_remaining_seconds,
        current_section=active_session.current_section,
        strike_count=active_session.strike_count,
        questions=grouped_questions,
        saved_answers=saved_answers
    )


@router.get("/active", response_model=Optional[AssessmentSessionOut])
def get_active_session(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    active_session = db.query(AssessmentSession).filter(
        AssessmentSession.student_id == current_student.id,
        AssessmentSession.status == "in_progress"
    ).first()

    if not active_session:
        return None

    domain = active_session.domain
    all_questions = db.query(Question).filter(
        (Question.domain == "common") | (Question.domain == domain)
    ).all()

    sections_order = ["aptitude", "programming", "debugging", "technical_mcq", "output_prediction", "short_answer"]
    grouped_questions: Dict[str, List[QuestionPublic]] = {sec: [] for sec in sections_order}

    for q in all_questions:
        if q.section in grouped_questions:
            grouped_questions[q.section].append(build_public_question(q))

    saved_answers_records = db.query(StudentAnswer).filter(StudentAnswer.session_id == active_session.id).all()
    saved_answers: Dict[int, Dict[str, Any]] = {}
    for sa in saved_answers_records:
        saved_answers[sa.question_id] = {
            "selected_option": sa.selected_option,
            "code_submission": sa.code_submission,
            "text_response": sa.text_response,
            "language": sa.language
        }

    return AssessmentSessionOut(
        session_id=active_session.id,
        student_name=current_student.name,
        student_email=current_student.email,
        domain=active_session.domain,
        status=active_session.status,
        total_duration_seconds=active_session.total_duration_seconds,
        time_remaining_seconds=active_session.time_remaining_seconds,
        current_section=active_session.current_section,
        strike_count=active_session.strike_count,
        questions=grouped_questions,
        saved_answers=saved_answers
    )


@router.post("/save-answer", response_model=AutoSaveResponse)
def auto_save_answer(
    payload: AutoSaveRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == payload.session_id,
        AssessmentSession.student_id == current_student.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Assessment session not found.")
    
    if session.status != "in_progress":
        raise HTTPException(status_code=400, detail="Cannot save answers for a non-active session.")

    session.current_section = payload.current_section
    session.time_remaining_seconds = payload.time_remaining_seconds

    saved_count = 0
    for ans in payload.answers:
        existing_answer = db.query(StudentAnswer).filter(
            StudentAnswer.session_id == payload.session_id,
            StudentAnswer.question_id == ans.question_id
        ).first()

        if existing_answer:
            existing_answer.selected_option = ans.selected_option
            existing_answer.code_submission = ans.code_submission
            existing_answer.language = ans.language
            existing_answer.text_response = ans.text_response
            saved_count += 1
        else:
            new_ans = StudentAnswer(
                session_id=payload.session_id,
                question_id=ans.question_id,
                selected_option=ans.selected_option,
                code_submission=ans.code_submission,
                language=ans.language,
                text_response=ans.text_response
            )
            db.add(new_ans)
            saved_count += 1

    db.commit()
    return AutoSaveResponse(status="success", saved_count=saved_count, timestamp=datetime.utcnow())


@router.post("/submit", response_model=AssessmentResultOut)
def submit_assessment_alias(
    payload: AssessmentSubmitRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    from app.routes.results import evaluate_and_generate_result
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == payload.session_id,
        AssessmentSession.student_id == current_student.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Assessment session not found.")

    if payload.final_answers:
        for ans in payload.final_answers:
            existing_ans = db.query(StudentAnswer).filter(
                StudentAnswer.session_id == payload.session_id,
                StudentAnswer.question_id == ans.question_id
            ).first()
            if existing_ans:
                existing_ans.selected_option = ans.selected_option
                existing_ans.code_submission = ans.code_submission
                existing_ans.language = ans.language
                existing_ans.text_response = ans.text_response
            else:
                new_a = StudentAnswer(
                    session_id=payload.session_id,
                    question_id=ans.question_id,
                    selected_option=ans.selected_option,
                    code_submission=ans.code_submission,
                    language=ans.language,
                    text_response=ans.text_response
                )
                db.add(new_a)
        db.commit()

    return evaluate_and_generate_result(session, current_student, db)
