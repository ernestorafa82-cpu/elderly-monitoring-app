from fastapi import APIRouter, Depends
from sqlmodel import select, Session
from app.db import get_session
from app.models import Event

router = APIRouter()

@router.get("/")
def get_timeline(limit: int = 100, session: Session = Depends(get_session)):
    q = select(Event).order_by(Event.created_at.desc()).limit(limit)
    items = session.exec(q).all()
    return {"count": len(items), "items": items}
