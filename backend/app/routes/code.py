import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Question
from app.schemas import CodeRunRequest, CodeRunResponse
from app.auth import get_current_student
from app.code_runner import execute_code, evaluate_test_cases

router = APIRouter(prefix="/code", tags=["Code Execution Engine"])

@router.post("/run", response_model=CodeRunResponse)
def run_code(
    payload: CodeRunRequest,
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if not payload.code or not payload.code.strip():
        raise HTTPException(status_code=400, detail="No code provided for execution.")

    # If associated with a question, run against the public sample test cases
    if payload.question_id:
        question = db.query(Question).filter(Question.id == payload.question_id).first()
        if question and question.test_cases_json:
            try:
                all_tc = json.loads(question.test_cases_json)
                # Filter only sample/public test cases for on-demand test runs
                sample_tc = [tc for tc in all_tc if not tc.get("hidden", False)]
                if sample_tc:
                    res = evaluate_test_cases(payload.language, payload.code, sample_tc)
                    return CodeRunResponse(
                        success=res["success"],
                        output=res["output"],
                        execution_time_ms=res["execution_time_ms"],
                        test_results=res["test_results"],
                        all_passed=res["all_passed"]
                    )
            except Exception as e:
                pass

    # Custom stdin execution fallback
    res = execute_code(payload.language, payload.code, custom_input=payload.custom_input or "")
    return CodeRunResponse(
        success=res["success"],
        output=res["output"],
        error=res["error"],
        execution_time_ms=res["execution_time_ms"],
        test_results=None,
        all_passed=None
    )
