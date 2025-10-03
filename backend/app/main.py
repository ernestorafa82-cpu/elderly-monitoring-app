
from fastapi import FastAPI, Depends
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy import text
import os

from app.core.db import get_db
# from app.routes import events  # <- descomenta si ya tienes el router creado

app = FastAPI(title="Elderly API")

# CORS (ajusta orígenes en tu .env si quieres)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluye rutas (si usas router)
# app.include_router(events.router)

@app.get("/health")
def health(db=Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}
