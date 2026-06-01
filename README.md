# AndikaKost (PoC)

Kost Tenant & Housing Management System PoC (Admin + Tenant) based on the provided PRD and development plan.

## Stack

- Frontend: React + Vite + Tailwind + React Router + TanStack Query + Zustand
- Backend: FastAPI + SQLAlchemy + Alembic + PostgreSQL

## Prerequisites

- Docker (for PostgreSQL)
- Python 3.12+
- Node.js 18+

## Local Setup

### 1) Start Docker Compose stack

```bash
docker compose up -d --build
```

### Auto-restart after power outage/reboot

This repository now uses `restart: unless-stopped` for `db`, `backend`, and `frontend` in `docker-compose.yml`.

One-time host setup (Linux server):

```bash
sudo systemctl enable --now docker
```

Verification:

```bash
docker compose ps
docker inspect -f "{{.Name}} => {{.HostConfig.RestartPolicy.Name}}" andika_kost_db andika_kost_backend andika_kost_frontend
```

If Docker service starts on boot, containers will come back automatically after outage/reboot.

### 2) Backend

```bash
cd AndikaKost-Backend
copy .env.example .env
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
python -m app.db.init_db
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API docs:

- Swagger: `http://localhost:8000/docs`
- Health: `http://localhost:8000/api/v1/health`

### 3) Frontend

```bash
cd AndikaKost-Frontend
npm install
npm run dev
```

Frontend:

- `http://localhost:5173`

Public pages:

- Home/overview: `http://localhost:5173/`
- Available rooms + booking request: `http://localhost:5173/rooms`

## Seed Admin Account

Configured in `AndikaKost-Backend/.env`:

- `SEED_ADMIN_EMAIL` (default: `admin@example.com`)
- `SEED_ADMIN_PASSWORD` (default: `ChangeMe123!`)

## Notes

- Payment proof and complaint photos are stored locally in `AndikaKost-Backend/uploads/` and served at `/uploads/...`.
- Tenant accounts can be created by Admin via **Admin → Tenants → Add tenant**.
- Booking requests approved from **Admin → Bookings** are auto-converted into tenant accounts and the selected room is set to `occupied`.
- Booking requests are created from the public rooms page and can be reviewed by Admin via **Admin → Bookings**.

## Project Status & Roadmap

See `docs/PROJECT_STATUS.md`.

## UI Documentation

- UI overhaul (responsive + admin accessibility + sleek public): `docs/UI_OVERHAUL_RESPONSIVE_A11Y.md`
