# backend/migrations/env.py
from logging.config import fileConfig
from alembic import context
from sqlalchemy import engine_from_config, pool
import os

# Alembic Config object
config = context.config

# Logging
if config.config_file_name:
    fileConfig(config.config_file_name)

# No importes nada de tu app; si no usas autogenerate, puedes dejar None
target_metadata = None

def get_url() -> str:
    # Usa la URL del .env en Docker; fallback a la de Docker por defecto
    return os.getenv("DATABASE_URL", "postgresql+psycopg://elderly:elderly@db:5432/elderly")

def run_migrations_offline():
    """Run migrations in 'offline' mode."""
    url = get_url()
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online():
    """Run migrations in 'online' mode."""
    configuration = config.get_section(config.config_ini_section)
    # Forzamos la URL desde el entorno
    configuration["sqlalchemy.url"] = get_url()

    connectable = engine_from_config(
        configuration, prefix="sqlalchemy.", poolclass=pool.NullPool
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()


