from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field

class Event(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    type: str
    payload: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
