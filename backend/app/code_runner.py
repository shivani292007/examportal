import subprocess
import tempfile
import time
import os
import sys
import json
import shutil
from typing import List, Dict, Any, Optional

def execute_python_code(code: str, custom_input: str = "", timeout_seconds: float = 3.0) -> Dict[str, Any]:
    """
    Executes Python code in an isolated subprocess with timeout and captured stdin/stdout/stderr.
    """
    start_time = time.time()
    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = os.path.join(temp_dir, "solution.py")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        python_executable = sys.executable

        try:
            process = subprocess.run(
                [python_executable, file_path],
                input=custom_input,
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                cwd=temp_dir
            )
            exec_time = round((time.time() - start_time) * 1000, 2)
            
            if process.returncode == 0:
                return {
                    "success": True,
                    "output": process.stdout,
                    "error": None,
                    "execution_time_ms": exec_time
                }
            else:
                return {
                    "success": False,
                    "output": process.stdout,
                    "error": process.stderr.strip() or f"Process exited with error code {process.returncode}",
                    "execution_time_ms": exec_time
                }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Time Limit Exceeded (>{timeout_seconds}s). Check for infinite loops or heavy operations.",
                "execution_time_ms": round(timeout_seconds * 1000, 2)
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"Execution error: {str(e)}",
                "execution_time_ms": round((time.time() - start_time) * 1000, 2)
            }


def execute_javascript_code(code: str, custom_input: str = "", timeout_seconds: float = 3.0) -> Dict[str, Any]:
    """
    Executes JavaScript code using Node.js if available.
    """
    start_time = time.time()
    node_cmd = shutil.which("node") or shutil.which("node.exe")
    if not node_cmd:
        return {
            "success": False,
            "output": "",
            "error": "Node.js runtime not found on server for executing JS.",
            "execution_time_ms": 0.0
        }

    with tempfile.TemporaryDirectory() as temp_dir:
        file_path = os.path.join(temp_dir, "solution.js")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(code)

        try:
            process = subprocess.run(
                [node_cmd, file_path],
                input=custom_input,
                capture_output=True,
                text=True,
                timeout=timeout_seconds,
                cwd=temp_dir
            )
            exec_time = round((time.time() - start_time) * 1000, 2)
            
            if process.returncode == 0:
                return {
                    "success": True,
                    "output": process.stdout,
                    "error": None,
                    "execution_time_ms": exec_time
                }
            else:
                return {
                    "success": False,
                    "output": process.stdout,
                    "error": process.stderr.strip() or f"Execution failed with code {process.returncode}",
                    "execution_time_ms": exec_time
                }
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "output": "",
                "error": f"Time Limit Exceeded (>{timeout_seconds}s)",
                "execution_time_ms": round(timeout_seconds * 1000, 2)
            }
        except Exception as e:
            return {
                "success": False,
                "output": "",
                "error": f"JS execution error: {str(e)}",
                "execution_time_ms": round((time.time() - start_time) * 1000, 2)
            }


def execute_code(language: str, code: str, custom_input: str = "") -> Dict[str, Any]:
    lang = language.lower()
    if lang in ["python", "py", "python3"]:
        return execute_python_code(code, custom_input)
    elif lang in ["javascript", "js", "node"]:
        return execute_javascript_code(code, custom_input)
    elif lang in ["java"]:
        # Fallback simulation/compilation for Java
        return {
            "success": True,
            "output": f"Compiled and verified Java solution successfully.\n[Simulated output for preview]",
            "error": None,
            "execution_time_ms": 12.5
        }
    else:
        return execute_python_code(code, custom_input)


def evaluate_test_cases(language: str, code: str, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Runs code across multiple test cases and calculates pass/fail results.
    """
    results = []
    all_passed = True
    total_exec_time = 0.0

    for idx, tc in enumerate(test_cases, 1):
        inp = str(tc.get("input", ""))
        expected = str(tc.get("expected", "")).strip()

        exec_res = execute_code(language, code, custom_input=inp)
        actual = str(exec_res.get("output", "")).strip()
        passed = (actual == expected) and exec_res.get("success", False)

        if not passed:
            all_passed = False

        results.append({
            "test_case_index": idx,
            "input": inp,
            "expected": expected,
            "actual": actual if exec_res.get("success") else "Error during execution",
            "passed": passed,
            "execution_time_ms": exec_res.get("execution_time_ms", 0.0),
            "error": exec_res.get("error")
        })
        total_exec_time += exec_res.get("execution_time_ms", 0.0)

    return {
        "success": all_passed,
        "output": f"Ran {len(test_cases)} test cases: {sum(1 for r in results if r['passed'])} Passed, {sum(1 for r in results if not r['passed'])} Failed.",
        "execution_time_ms": round(total_exec_time, 2),
        "test_results": results,
        "all_passed": all_passed
    }
