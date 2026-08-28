# AI-Resistant Secure Online Skill Assessment Portal

> **Core Module of**: *Portal for Academia–Industry Collaboration for Skill Mapping, Internships and Placement*

A high-security, browser-hardened online examination and skill evaluation platform engineered to evaluate candidate practical ability, coding mastery, algorithmic problem solving, debugging skills, and architectural understanding under an anti-cheating environment.

---

## 1. System Architecture & Innovation Overview

Unlike standard multiple-choice quiz systems, this platform implements **multi-modal, practical evaluation** that makes external AI assistance, code copying, and tab switching difficult and traceable.

```
Student Profile & Domain Selection
             ↓
Assessment Integrity Rules & Fullscreen Consent
             ↓
Secure 6-Section Assessment Engine
 ├── 1. Aptitude (Quantitative, Logical, Combinatorics)
 ├── 2. Programming (Integrated Code Editor, Live Test Cases)
 ├── 3. Debugging (Faulty Snippet Inspection & Code Repair)
 ├── 4. Technical MCQ (Domain Specialization: Python/Java/JS/SQL/DSA)
 ├── 5. Output Prediction (Execution Logic & Edge Case Reasoning)
 └── 6. Short Answer / Concept (System Architecture & Trade-Offs)
             ↓
Real-Time Anti-Cheating & Integrity Monitoring Subsystem
 ├── Clipboard Locks (Copy/Paste/Cut strictly blocked)
 ├── Tab Switch & Blur Tracking (3-Strike Auto-Submission)
 ├── Fullscreen Enforcement & Violation Prompts
 ├── Shortcut Interception (F12, Ctrl+Shift+I/J/C, Ctrl+U/S/P)
 └── Dynamic Traceable Watermark Overlay (Student ID • Session UUID)
             ↓
Auto-Save & Resilient Session Recovery
             ↓
Submission & Automated Test Suite Evaluation
             ↓
Skill Mapping & Placement Matching Engine
 ├── Granular Skill Competency Matrix
 ├── Strong Skills vs. Identified Skill Gaps
 └── Matched Industry Internship & Placement Opportunities
```

---

## 2. Assessment Sections

| Section | Questions | Format & Objective |
| :--- | :--- | :--- |
| **1. Aptitude** | 10 Qs | Quantitative arithmetic, logic deduction, time & work, probability, combinatorics, sequence patterns. |
| **2. Programming** | 5 Problems | Practical algorithm implementation with custom CodeEditor, Python/Java/JS support, and live test runner. |
| **3. Debugging** | 5 Problems | Real-world faulty code snippets with syntax, logical, or runtime mutation bugs to identify and repair. |
| **4. Technical MCQ** | 10 Qs | Domain-specific deep dives (Python GIL/decorators, Java JVM/concurrency, JS Event Loop, SQL ACID/indexes, DSA complexity). |
| **5. Output Prediction** | 5 Problems | Tricky snippet analysis testing actual runtime understanding rather than rote memorization. |
| **6. Short Answer / Concept**| 4 Problems | Real-world architectural design (stream deduplication, connection pooling, concurrency control, caching). |

---

## 3. Anti-Cheating & Integrity Monitoring System

### A. Strict Clipboard & Code Protection
- **Disabled Paste (`Ctrl+V`)**: Candidates cannot paste external code or AI answers into the code editor or answer fields. Manual typing is strictly enforced.
- **Disabled Copy (`Ctrl+C`) & Cut (`Ctrl+X`)**: Prevents copying exam questions or code snippets to external tools.
- **Context Menu Interception**: Right-click context menu is blocked across the application.
- **Non-Selectable Question Text**: CSS `user-select: none` and event listeners prevent highlighting question statements for OCR scrapers.

### B. Tab Switching & Window Focus (3-Strike System)
- Listens to `document.visibilitychange`, `window.onblur`, and `window.onfocus`.
- **Strike 1**: Warning modal explaining that leaving the examination window is prohibited.
- **Strike 2**: Severe warning modal noting 1 violation remaining.
- **Strike 3**: Automatic immediate submission and session lockout.

### C. Fullscreen Enforcement
- Requires candidate to enter HTML5 Fullscreen before test begins.
- Listens to `fullscreenchange`. If exited, triggers an overlay prompting immediate re-entry and logs the violation to the backend.

### D. Keyboard Shortcut Interception
- Intercepts and blocks: `F12`, `Ctrl+Shift+I`, `Ctrl+Shift+J`, `Ctrl+Shift+C`, `Ctrl+U`, `Ctrl+S`, `Ctrl+P`, `Ctrl+A`.

### E. Developer Tools Detection Heuristics
- Heuristic checks via window outer/inner dimension variance (`window.outerWidth - window.innerWidth > 160`) and debugger timing checks to log attempts.

### F. Dynamic Traceable Watermark Overlay
- Renders a continuous, subtle diagonal watermark across the entire screen displaying:  
  `Assessment Session • Student ID: <ID> • Session: <UUID> • Local Time`  
  This makes any camera photo or external recording identifiable and attributable.

### G. Transparent Technical Limitation Documentation
> **Honest Engineering Note**: Standard web browsers run inside a sandboxed operating system environment. A browser application cannot physically block OS-level hardware screen capture or external secondary devices (e.g. mobile cameras). The system mitigates these boundaries through defense-in-depth: manual typing enforcement, anti-paste locks, strict tab monitoring, randomized question banks, timed sections, and dynamic session watermarks.

---

## 4. Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
- **Backend**: Python 3.14 / 3.11+, FastAPI, SQLAlchemy, Pydantic v2, PyJWT, Passlib, Native Bcrypt, Uvicorn
- **Database**: SQLite (default zero-friction development) + MySQL 8.0 DDL script (`schema.sql`)
- **Code Execution**: Isolated subprocess test runner with standard input/output matching and millisecond execution metrics.

---

## 5. Quickstart & Running Locally

### Step 1: Start the Backend Server
```bash
cd backend

# Activate virtual environment
# On Windows PowerShell:
.venv\Scripts\Activate.ps1
# Or on CMD:
# .venv\Scripts\activate.bat

# Run the FastAPI server (runs on http://127.0.0.1:8000)
python run.py
```
*The backend automatically creates database tables and seeds the 45-question bank upon startup.*

### Step 2: Start the Frontend Application
```bash
cd frontend

# Run Vite dev server (runs on http://localhost:5173)
npm run dev
```

Open your browser at `http://localhost:5173` to access the portal.

---

## 6. API Endpoints Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new student profile
- `POST /api/auth/login`: Authenticate and receive JWT bearer token
- `GET /api/auth/me`: Get current candidate profile

### Assessment Engine (`/api/assessment`)
- `POST /api/assessment/start`: Initialize or retrieve randomized exam session (strips secret answers)
- `GET /api/assessment/active`: Check for in-progress session on reload
- `POST /api/assessment/save-answer`: Real-time debounced auto-save of answers and remaining timer
- `POST /api/assessment/submit`: Finalize exam, evaluate test cases, and generate skill results

### Code Execution (`/api/code`)
- `POST /api/code/run`: Execute student code against public sample test cases with live outputs and runtime

### Integrity Monitoring (`/api/integrity`)
- `POST /api/integrity/log`: Record violation events (`tab_switch`, `paste_attempt`, `fullscreen_exit`, `devtools_detected`)
- `GET /api/integrity/status/{session_id}`: Retrieve active violation counts and strike status

### Results & Skill Mapping (`/api/results`)
- `GET /api/results/report/{session_id}`: Retrieve complete competency matrix, skill radar, strong/weak skills, skill gaps, and matched corporate placement opportunities.

---

## 7. Connecting to the Academia–Industry Collaboration Portal

The output generated by this assessment module feeds directly into the overarching platform:
1. **Skill Mapping**: Granular skill scores (e.g., Python: 85%, Problem Solving: 78%, Debugging: 65%) update the student's institutional profile.
2. **Skill Gap Identification**: Weak skills automatically suggest targeted bridge training modules.
3. **Internship & Placement Matching**: Corporate recruiters filter candidates with verified, anti-cheating-certified assessment performance.
#   e x a m p o r t a l  
 