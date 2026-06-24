.PHONY: install-backend install-frontend install makemigrations migrate run-backend run-frontend setup test-backend

install-backend:
	cd backend && poetry install

install-frontend:
	cd frontend && pnpm install

install: install-backend install-frontend

makemigrations:
	cd backend && poetry run python manage.py makemigrations

migrate:
	cd backend && poetry run python manage.py migrate

run-backend:
	cd backend && poetry run python manage.py runserver

run-frontend:
	cd frontend && pnpm run dev

setup: install makemigrations migrate
	cd backend && poetry run python manage.py createsuperuser

test-backend:
	cd backend && poetry run python manage.py test


