from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field

# Contratos DTO (buenas prácticas)
class EventBase(SQLModel):
    type: str
    payload: str

class EventCreate(EventBase):
    pass

class EventRead(EventBase):
    id: int
    created_at: datetime

# Tabla persistente
class Event(EventBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
