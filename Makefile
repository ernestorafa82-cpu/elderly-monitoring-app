up:        ## Levanta todo con build
cd infrastructure && docker compose up --build

down:      ## Baja todos los servicios
cd infrastructure && docker compose down

logs:      ## Logs del backend
cd infrastructure && docker compose logs -f backend

ps:        ## Estado de servicios
cd infrastructure && docker compose ps

migrate:   ## Ejecuta migraciones Alembic en el contenedor backend
docker compose -f infrastructure/docker-compose.yml exec -T elderly-backend alembic upgrade head

revision:  ## Crea una nueva migración (autogenerate)
docker compose -f infrastructure/docker-compose.yml exec -T elderly-backend alembic revision --autogenerate -m "update"
