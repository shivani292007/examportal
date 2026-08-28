from collections import Counter
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AssessmentSession, IntegrityEvent
from app.schemas import IntegrityEventCreate, IntegrityStatusOut
from app.auth import get_current_student
from app.config import settings

router = APIRouter(prefix="/integrity", tags=["Anti-Cheating Integrity Engine"])

@router.post("/log", response_model=IntegrityStatusOut)
def log_integrity_event(
    payload: IntegrityEventCreate,
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == payload.session_id,
        AssessmentSession.student_id == current_student.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    # Record event
    event = IntegrityEvent(
        session_id=payload.session_id,
        event_type=payload.event_type,
        details=payload.details,
        severity=payload.severity or "warning",
        timestamp=datetime.utcnow()
    )
    db.add(event)

    # Major violations increment strike count (Tab Switches & Fullscreen Exits)
    if payload.event_type in ["tab_switch", "fullscreen_exit", "devtools_detected"]:
        session.strike_count = (session.strike_count or 0) + 1
        if session.strike_count >= settings.MAX_INTEGRITY_STRIKES:
            session.status = "terminated"

    db.commit()

    # Calculate summary
    all_events = db.query(IntegrityEvent).filter(IntegrityEvent.session_id == payload.session_id).all()
    event_counts = dict(Counter(e.event_type for e in all_events))
    
    recent = [
        {
            "id": e.id,
            "event_type": e.event_type,
            "details": e.details,
            "severity": e.severity,
            "timestamp": e.timestamp.isoformat() if e.timestamp else None
        }
        for e in sorted(all_events, key=lambda x: x.timestamp or datetime.min, reverse=True)[:10]
    ]

    return IntegrityStatusOut(
        session_id=session.id,
        strike_count=session.strike_count or 0,
        max_strikes=settings.MAX_INTEGRITY_STRIKES,
        is_terminated=session.status == "terminated",
        total_violations=len(all_events),
        events_summary=event_counts,
        recent_events=recent
    )


@router.get("/status/{session_id}", response_model=IntegrityStatusOut)
def get_integrity_status(
    session_id: str,
    current_student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.student_id == current_student.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    all_events = db.query(IntegrityEvent).filter(IntegrityEvent.session_id == session_id).all()
    event_counts = dict(Counter(e.event_type for e in all_events))

    recent = [
        {
            "id": e.id,
            "event_type": e.event_type,
            "details": e.details,
            "severity": e.severity,
            "timestamp": e.timestamp.isoformat() if e.timestamp else None
        }
        for e in sorted(all_events, key=lambda x: x.timestamp or datetime.min, reverse=True)[:10]
    ]

    return IntegrityStatusOut(
        session_id=session.id,
        strike_count=session.strike_count or 0,
        max_strikes=settings.MAX_INTEGRITY_STRIKES,
        is_terminated=session.status == "terminated",
        total_violations=len(all_events),
        events_summary=event_counts,
        recent_events=recent
    )
