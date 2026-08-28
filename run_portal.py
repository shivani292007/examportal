import os
import sys
import webbrowser
import threading
import time
import uvicorn

def open_browser():
    time.sleep(1.2)
    print("\n" + "=" * 70)
    print(">>> Opening portal in your web browser: http://localhost:8000")
    print("=" * 70 + "\n")
    webbrowser.open("http://localhost:8000")

if __name__ == "__main__":
    # Ensure backend directory is in sys.path
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    # Launch browser in a background thread
    threading.Thread(target=open_browser, daemon=True).start()

    print("=" * 70)
    print("  AI-Resistant Skill Assessment Portal (Unified Server)")
    print("  Hosted at: http://localhost:8000")
    print("  API Docs : http://localhost:8000/docs")
    print("=" * 70)

    # Run Uvicorn server
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=False, app_dir=backend_dir)
