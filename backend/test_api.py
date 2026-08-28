import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

    health = client.get("/api/health")
    assert health.status_code == 200
    assert health.json()["status"] == "healthy"


def test_auth_flow():
    # Register test student
    reg_payload = {
        "name": "Alex Mercer",
        "email": "alex.mercer@univ.edu",
        "password": "SecurePassword123!",
        "college": "Institute of Technology",
        "roll_number": "CS2026-089",
        "target_domain": "Python"
    }
    res = client.post("/api/auth/register", json=reg_payload)
    if res.status_code == 400: # Already registered in test run
        login_res = client.post("/api/auth/login", json={"email": reg_payload["email"], "password": reg_payload["password"]})
        assert login_res.status_code == 200
        token = login_res.json()["access_token"]
    else:
        assert res.status_code == 200
        token = res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "alex.mercer@univ.edu"

    # Start assessment
    start_res = client.post("/api/assessment/start", json={"domain": "Python"}, headers=headers)
    assert start_res.status_code == 200
    sess_data = start_res.json()
    session_id = sess_data["session_id"]
    assert "questions" in sess_data
    assert "aptitude" in sess_data["questions"]
    assert "programming" in sess_data["questions"]

    # Verify that correct_answer is NOT exposed in the questions payload
    first_q = sess_data["questions"]["aptitude"][0]
    assert "correct_answer" not in first_q

    # Test auto-save
    save_payload = {
        "session_id": session_id,
        "current_section": "aptitude",
        "time_remaining_seconds": 5200,
        "answers": [
            {
                "question_id": first_q["id"],
                "selected_option": first_q["options"][0] if first_q.get("options") else "Option A"
            }
        ]
    }
    save_res = client.post("/api/assessment/save-answer", json=save_payload, headers=headers)
    assert save_res.status_code == 200

    # Test code runner
    code_payload = {
        "language": "python",
        "code": "print('Hello Assessment')",
        "custom_input": ""
    }
    code_res = client.post("/api/code/run", json=code_payload, headers=headers)
    assert code_res.status_code == 200
    assert "Hello Assessment" in code_res.json()["output"]

    # Test integrity logging
    int_payload = {
        "session_id": session_id,
        "event_type": "copy_attempt",
        "details": "User attempted Ctrl+C on Question description",
        "severity": "warning"
    }
    int_res = client.post("/api/integrity/log", json=int_payload, headers=headers)
    assert int_res.status_code == 200
    assert int_res.json()["total_violations"] >= 1

    # Test submit assessment
    sub_res = client.post("/api/assessment/submit", json={"session_id": session_id}, headers=headers)
    assert sub_res.status_code == 200
    result_data = sub_res.json()
    assert "overall_score" in result_data
    assert "skill_scores" in result_data
    assert "career_recommendations" in result_data
    assert len(result_data["career_recommendations"]) > 0

    print("All backend integration tests passed successfully!")

if __name__ == "__main__":
    test_root_and_health()
    test_auth_flow()
