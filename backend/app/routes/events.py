from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.db import get_db
from app.models import Event
from app.schemas import EventCreate, EventOut  # ajusta nombres si tus esquemas se llaman distinto

# Compatibilidad Pydantic v1/v2
try:
    _v2 = hasattr(EventOut, "model_dump")
except Exception:
    _v2 = False

router = APIRouter(prefix="/events", tags=["events"])

@router.get("/", response_model=list[EventOut])
def list_events(
    db: Session = Depends(get_db),
    limit: int = 50,
    offset: int = 0,
):
    return (
        db.query(Event)
        .order_by(Event.id.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

@router.post("/", response_model=EventOut, status_code=201)
def create_event(body: EventCreate, db: Session = Depends(get_db)):
    data = body.model_dump() if _v2 else body.dict()
    ev = Event(**data)
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    ev = db.get(Event, event_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Not found")
    return ev

@router.delete("/{event_id}", status_code=204)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    ev = db.get(Event, event_id)
    if not ev:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(ev)
    db.commit()
