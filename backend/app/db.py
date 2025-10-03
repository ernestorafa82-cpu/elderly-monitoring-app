import os
from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app.db")
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True, connect_args=connect_args)

def init_db() -> None:
    # Para arranque sin Alembic (dev). En prod, usa migraciones.
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
