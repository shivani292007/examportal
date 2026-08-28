import json
from datetime import datetime
from collections import defaultdict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student, AssessmentSession, Question, StudentAnswer, AssessmentResult, IntegrityEvent
from app.schemas import AssessmentSubmitRequest, AssessmentResultOut, SectionScoreDetail, SkillScoreDetail, PlacementOpportunity
from app.auth import get_current_student
from app.code_runner import evaluate_test_cases

router = APIRouter(prefix="/results", tags=["Results & Skill Mapping Engine"])

INDUSTRY_ROLE_PROFILES = [
    {
        "role_title": "Junior Backend Software Engineer (Fast-Track)",
        "company_type": "Product & FinTech Enterprises",
        "required_skills": ["Python", "Java", "Database Engineering", "Problem Solving", "System Design"],
        "min_score": 70,
        "description": "Direct fast-track interview consideration for high-throughput backend services and microservices development."
    },
    {
        "role_title": "Full-Stack Development Intern",
        "company_type": "SaaS & High-Growth Startups",
        "required_skills": ["JavaScript", "Python", "Problem Solving", "Debugging"],
        "min_score": 60,
        "description": "Recommended for client-server web applications, RESTful API integrations, and modern UI engineering."
    },
    {
        "role_title": "QA Automation & Test Reliability Intern",
        "company_type": "Global IT & Cloud Platforms",
        "required_skills": ["Debugging", "Code Reasoning", "Problem Solving"],
        "min_score": 55,
        "description": "Targeted for automated test suites, debugging regression pipelines, and test framework development."
    },
    {
        "role_title": "Data Engineering & Analytics Associate",
        "company_type": "Data Analytics & Enterprise Consultancies",
        "required_skills": ["SQL", "Quantitative Aptitude", "Logical Reasoning", "Python"],
        "min_score": 65,
        "description": "Recommended for ETL pipelines, relational data modeling, and business intelligence reporting."
    }
]


def determine_candidate_level(overall_percentage: float):
    if overall_percentage >= 85.0:
        level = "Expert / Industry-Ready"
        desc = "Demonstrates exceptional mastery across algorithms, live debugging, practical engineering, and system design. Ready for direct placement into high-tier product engineering and fast-track interviews."
        roadmap = "Target senior architectural projects, distributed systems design, and open-source contributions to maintain competitive edge."
    elif overall_percentage >= 70.0:
        level = "Advanced"
        desc = "Strong analytical problem-solving and solid coding skills. Can independently implement complex data structures, diagnose logic bugs, and build enterprise-grade modules."
        roadmap = "Refine advanced system scalability, concurrency edge cases, and high-throughput streaming architectures to reach Expert level."
    elif overall_percentage >= 50.0:
        level = "Intermediate"
        desc = "Possesses working foundational knowledge of core concepts, basic programming, and standard MCQs. Requires further hands-on practice in debugging tricky edge cases and complex algorithms."
        roadmap = "Focus on dynamic programming, two-pointer algorithms, and deeper debugging patterns to bridge the gap to the Advanced level."
    else:
        level = "Beginner / Foundational"
        desc = "Developing initial competencies in computational logic and basic programming syntax. Recommended for structured bridge training before technical placement rounds."
        roadmap = "Complete foundational problem-solving exercises, data structure basics (arrays, hash maps, strings), and guided syntax tutorials."

    return level, desc, roadmap


def evaluate_and_generate_result(session: AssessmentSession, student: Student, db: Session) -> AssessmentResultOut:
    all_questions = db.query(Question).filter(
        (Question.domain == "common") | (Question.domain == session.domain)
    ).all()
    
    saved_answers = {
        sa.question_id: sa for sa in db.query(StudentAnswer).filter(StudentAnswer.session_id == session.id).all()
    }

    section_stats = defaultdict(lambda: {"score": 0.0, "max_score": 0.0, "count": 0, "correct": 0})
    skill_stats = defaultdict(lambda: {"obtained": 0.0, "total": 0.0})

    total_obtained = 0.0
    total_max = 0.0

    for q in all_questions:
        ans = saved_answers.get(q.id)
        marks = float(q.marks)
        awarded = 0.0
        is_correct = False
        test_results_dump = None

        if q.section in ["aptitude", "technical_mcq", "output_prediction"]:
            if ans and ans.selected_option and q.correct_answer:
                if ans.selected_option.strip() == q.correct_answer.strip():
                    awarded = marks
                    is_correct = True
                else:
                    awarded = 0.0

        elif q.section in ["programming", "debugging"]:
            if ans and ans.code_submission and ans.code_submission.strip():
                tc_list = []
                if q.test_cases_json:
                    try:
                        tc_list = json.loads(q.test_cases_json)
                    except Exception:
                        tc_list = []
                
                if tc_list:
                    lang = ans.language or "python"
                    eval_res = evaluate_test_cases(lang, ans.code_submission, tc_list)
                    test_results_dump = json.dumps(eval_res.get("test_results", []))
                    
                    passed_count = sum(1 for t in eval_res.get("test_results", []) if t.get("passed"))
                    fraction = passed_count / len(tc_list) if len(tc_list) > 0 else 0
                    awarded = round(marks * fraction, 2)
                    is_correct = (fraction == 1.0)
                else:
                    awarded = marks * 0.5
            else:
                awarded = 0.0

        elif q.section == "short_answer":
            if ans and ans.text_response and ans.text_response.strip():
                keywords = [k.strip().lower() for k in (q.correct_answer or "").split()]
                response_text = ans.text_response.lower()
                matched = sum(1 for k in keywords if k in response_text)
                ratio = min(1.0, (matched / max(3, len(keywords) * 0.5))) if keywords else 0.7
                awarded = round(marks * ratio, 2)
                is_correct = (ratio >= 0.7)
            else:
                awarded = 0.0

        if ans:
            ans.is_evaluated = True
            ans.is_correct = is_correct
            ans.marks_obtained = awarded
            if test_results_dump:
                ans.test_results_json = test_results_dump
        else:
            new_ans = StudentAnswer(
                session_id=session.id,
                question_id=q.id,
                is_evaluated=True,
                is_correct=False,
                marks_obtained=0.0
            )
            db.add(new_ans)

        section_stats[q.section]["score"] += awarded
        section_stats[q.section]["max_score"] += marks
        section_stats[q.section]["count"] += 1
        if is_correct:
            section_stats[q.section]["correct"] += 1

        skill_tag = q.skill_tag or "General"
        skill_stats[skill_tag]["obtained"] += awarded
        skill_stats[skill_tag]["total"] += marks

        total_obtained += awarded
        total_max += marks

    overall_percentage = round((total_obtained / total_max * 100), 1) if total_max > 0 else 0.0
    cand_level, cand_desc, cand_roadmap = determine_candidate_level(overall_percentage)

    # Build section score details
    section_score_details = {}
    for sec, data in section_stats.items():
        pct = round((data["score"] / data["max_score"] * 100), 1) if data["max_score"] > 0 else 0.0
        section_score_details[sec] = SectionScoreDetail(
            section=sec,
            score=data["score"],
            max_score=data["max_score"],
            percentage=pct,
            questions_count=data["count"],
            correct_count=data["correct"]
        )

    # Build skill scores & details
    skill_scores_map = {}
    skill_details_list = []
    strong_skills = []
    weak_skills = []
    skill_gaps = []

    for skill, data in skill_stats.items():
        pct = round((data["obtained"] / data["total"] * 100), 1) if data["total"] > 0 else 0.0
        skill_scores_map[skill] = pct
        
        if pct >= 80:
            lvl = "Master / Expert"
            strong_skills.append(skill)
        elif pct >= 65:
            lvl = "Advanced"
            strong_skills.append(skill)
        elif pct >= 45:
            lvl = "Intermediate"
            weak_skills.append(skill)
            skill_gaps.append(f"Strengthen competencies in {skill} to move from Intermediate to Advanced")
        else:
            lvl = "Beginner"
            weak_skills.append(skill)
            skill_gaps.append(f"Critical Gap: Intensive foundational training required in {skill}")

        skill_details_list.append(SkillScoreDetail(
            skill=skill,
            score_percentage=pct,
            level=lvl,
            category="Technical & Problem Solving"
        ))

    # Match industry roles
    recommendations = []
    for role in INDUSTRY_ROLE_PROFILES:
        role_skills = role["required_skills"]
        matched_scores = [skill_scores_map.get(s, overall_percentage) for s in role_skills]
        avg_role_score = sum(matched_scores) / len(matched_scores) if matched_scores else overall_percentage
        
        recommendations.append(PlacementOpportunity(
            role_title=role["role_title"],
            company_type=role["company_type"],
            required_skills=role["required_skills"],
            match_percentage=round(avg_role_score, 1),
            recommendation_note=role["description"]
        ))

    recommendations.sort(key=lambda x: x.match_percentage, reverse=True)

    if overall_percentage >= 80:
        band = "Elite (Direct Corporate Interview Ready)"
    elif overall_percentage >= 65:
        band = "Ready for Placement & Core Internship"
    elif overall_percentage >= 50:
        band = "Needs Targeted Bridge Training"
    else:
        band = "Foundational Upskilling Required"

    integrity_events = db.query(IntegrityEvent).filter(IntegrityEvent.session_id == session.id).all()
    integrity_summary = {
        "strike_count": session.strike_count or 0,
        "total_events": len(integrity_events),
        "status": "Verified Clean" if (session.strike_count or 0) == 0 else f"{session.strike_count} Integrity Warnings Recorded"
    }

    def dump_model(m):
        return m.model_dump() if hasattr(m, "model_dump") else m.dict()

    section_scores_raw = {k: dump_model(v) for k, v in section_score_details.items()}
    recommendations_raw = [dump_model(r) for r in recommendations]

    # Save AssessmentResult model
    existing_res = db.query(AssessmentResult).filter(AssessmentResult.session_id == session.id).first()
    if not existing_res:
        new_res = AssessmentResult(
            session_id=session.id,
            student_id=student.id,
            overall_score=round(total_obtained, 2),
            max_score=round(total_max, 2),
            percentage=overall_percentage,
            section_scores_json=json.dumps(section_scores_raw),
            skill_scores_json=json.dumps(skill_scores_map),
            strong_skills_json=json.dumps(strong_skills),
            weak_skills_json=json.dumps(weak_skills),
            skill_gaps_json=json.dumps(skill_gaps),
            recommendations_json=json.dumps(recommendations_raw),
            submitted_at=datetime.utcnow()
        )
        db.add(new_res)
    else:
        existing_res.overall_score = round(total_obtained, 2)
        existing_res.max_score = round(total_max, 2)
        existing_res.percentage = overall_percentage
        existing_res.section_scores_json = json.dumps(section_scores_raw)
        existing_res.skill_scores_json = json.dumps(skill_scores_map)
        existing_res.strong_skills_json = json.dumps(strong_skills)
        existing_res.weak_skills_json = json.dumps(weak_skills)
        existing_res.skill_gaps_json = json.dumps(skill_gaps)
        existing_res.recommendations_json = json.dumps(recommendations_raw)
        existing_res.submitted_at = datetime.utcnow()

    session.status = "submitted"
    session.overall_score = round(total_obtained, 2)
    session.end_time = datetime.utcnow()
    db.commit()

    return AssessmentResultOut(
        session_id=session.id,
        student_name=student.name,
        domain=session.domain,
        overall_score=round(total_obtained, 2),
        max_score=round(total_max, 2),
        percentage=overall_percentage,
        candidate_level=cand_level,
        candidate_level_description=cand_desc,
        next_milestone_recommendation=cand_roadmap,
        performance_band=band,
        section_scores=section_score_details,
        skill_scores=skill_scores_map,
        skill_details=skill_details_list,
        strong_skills=strong_skills,
        weak_skills=weak_skills,
        skill_gaps=skill_gaps,
        career_recommendations=recommendations,
        integrity_summary=integrity_summary,
        submitted_at=datetime.utcnow()
    )


@router.post("/submit", response_model=AssessmentResultOut)
def submit_assessment(
    payload: AssessmentSubmitRequest,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
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


@router.get("/report/{session_id}", response_model=AssessmentResultOut)
def get_assessment_report(
    session_id: str,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    session = db.query(AssessmentSession).filter(
        AssessmentSession.id == session_id,
        AssessmentSession.student_id == current_student.id
    ).first()

    if not session:
        raise HTTPException(status_code=404, detail="Assessment session not found.")

    res = db.query(AssessmentResult).filter(AssessmentResult.session_id == session_id).first()
    if not res:
        return evaluate_and_generate_result(session, current_student, db)

    section_scores_dict = {}
    for k, v in json.loads(res.section_scores_json).items():
        section_scores_dict[k] = SectionScoreDetail(**v)

    skill_scores_dict = json.loads(res.skill_scores_json)
    skill_details_list = [
        SkillScoreDetail(
            skill=k,
            score_percentage=v,
            level="Master / Expert" if v >= 80 else ("Advanced" if v >= 65 else ("Intermediate" if v >= 45 else "Beginner")),
            category="Technical & Problem Solving"
        )
        for k, v in skill_scores_dict.items()
    ]

    career_recs = [PlacementOpportunity(**r) for r in json.loads(res.recommendations_json)]

    integrity_events = db.query(IntegrityEvent).filter(IntegrityEvent.session_id == session.id).all()
    integrity_summary = {
        "strike_count": session.strike_count or 0,
        "total_events": len(integrity_events),
        "status": "Verified Clean" if (session.strike_count or 0) == 0 else f"{session.strike_count} Integrity Warnings Recorded"
    }

    cand_level, cand_desc, cand_roadmap = determine_candidate_level(res.percentage)

    if res.percentage >= 80:
        band = "Elite (Direct Corporate Interview Ready)"
    elif res.percentage >= 65:
        band = "Ready for Placement & Core Internship"
    elif res.percentage >= 50:
        band = "Needs Targeted Bridge Training"
    else:
        band = "Foundational Upskilling Required"

    return AssessmentResultOut(
        session_id=session.id,
        student_name=current_student.name,
        domain=session.domain,
        overall_score=res.overall_score,
        max_score=res.max_score,
        percentage=res.percentage,
        candidate_level=cand_level,
        candidate_level_description=cand_desc,
        next_milestone_recommendation=cand_roadmap,
        performance_band=band,
        section_scores=section_scores_dict,
        skill_scores=skill_scores_dict,
        skill_details=skill_details_list,
        strong_skills=json.loads(res.strong_skills_json),
        weak_skills=json.loads(res.weak_skills_json),
        skill_gaps=json.loads(res.skill_gaps_json),
        career_recommendations=career_recs,
        integrity_summary=integrity_summary,
        submitted_at=res.submitted_at
    )
