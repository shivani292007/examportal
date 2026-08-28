@echo off
title AI-Resistant Skill Assessment Portal
cd /d "%~dp0"

echo =========================================================================
echo  Starting AI-Resistant Secure Skill Assessment Portal
echo =========================================================================
echo.

if exist "backend\.venv\Scripts\python.exe" (
    echo [INFO] Using Python Virtual Environment...
    "backend\.venv\Scripts\python.exe" run_portal.py
) else (
    echo [INFO] Using System Python Launcher...
    py run_portal.py
)

pause
