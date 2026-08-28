import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed_data import seed_question_bank
from app.routes import auth, assessment, code, integrity, results

# Initialize database schema
Base.metadata.create_all(bind=engine)

# Seed question bank on startup if empty
db = SessionLocal()
try:
    seed_question_bank(db)
finally:
    db.close()

app = FastAPI(
    title="AI-Resistant Secure Skill Assessment Portal API",
    description="Backend API and unified single-port host for secure student skill assessment.",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(assessment.router, prefix="/api")
app.include_router(code.router, prefix="/api")
app.include_router(integrity.router, prefix="/api")
app.include_router(results.router, prefix="/api")

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "AI-Resistant Skill Assessment Portal"}

# Serve Frontend SPA directly from the same single port
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
frontend_dist = os.path.join(BASE_DIR, "frontend", "dist")
assets_dir = os.path.join(frontend_dist, "assets")

if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    # If a specific static file exists in dist, serve it
    if frontend_dist and os.path.exists(frontend_dist):
        file_path = os.path.join(frontend_dist, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        # Fallback to SPA index.html
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)

    return {
        "status": "online",
        "message": "Frontend build not found. Run 'npm run build' in frontend directory.",
        "docs": "/docs"
    }
