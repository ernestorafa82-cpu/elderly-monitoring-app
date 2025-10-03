from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session
from app.db import get_session
from app.models import Event

router = APIRouter()

@router.post("/", response_model=Event)
def create_event(event: Event, session: Session = Depends(get_session)):
    session.add(event)
    session.commit()
    session.refresh(event)
    return event

@router.get("/", response_model=list[Event])
def list_events(limit: int = 50, session: Session = Depends(get_session)):
    stmt = select(Event).order_by(Event.created_at.desc()).limit(limit)
    return session.exec(stmt).all()

@router.get("/{event_id}", response_model=Event)
def get_event(event_id: int, session: Session = Depends(get_session)):
    ev = session.get(Event, event_id)
    if not ev:
        raise HTTPException(404, "Event not found")
    return ev

@router.delete("/{event_id}")
def delete_event(event_id: int, session: Session = Depends(get_session)):
    ev = session.get(Event, event_id)
    if not ev:
        raise HTTPException(404, "Event not found")
    session.delete(ev)
    session.commit()
    return {"deleted": event_id}
