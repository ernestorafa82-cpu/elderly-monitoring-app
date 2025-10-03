from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from app.db import init_db
from app.routes import timeline, events

app = FastAPI(title="Elderly Monitoring API")

# --- CORS (poner SIEMPRE después de crear `app`) ---
frontend_origin = os.getenv("FRONTEND_ORIGIN", "http://localhost:3001")
allowed = {frontend_origin, "http://localhost:3001", "http://127.0.0.1:3001"}
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(allowed),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ---------------------------------------------------

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/health")
def health():
    return {"status": "ok"}

app.include_router(timeline.router, prefix="/timeline", tags=["timeline"])
app.include_router(events.router,  prefix="/events",   tags=["events"])
