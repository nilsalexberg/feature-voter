# Feature Voter

Community feature request board. Submit, browse, and upvote feature requests. Ranked by vote count.

## Stack

| Layer | Tech |
|-------|------|
| Backend | Django 6 + DRF + SimpleJWT |
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind v4 |
| Package managers | Poetry (backend) · pnpm (frontend) |

## Setup

```bash
make setup        # install deps, run migrations, create superuser
```

Or step by step:

```bash
make install      # poetry install + pnpm install
make makemigrations
make migrate
cd backend && poetry run python manage.py createsuperuser
```

## Running

```bash
make run-backend   # Django dev server → http://localhost:8000
make run-frontend  # Vite dev server → http://localhost:5173
```

## Testing

```bash
make test-backend
```

## Project Structure

```
backend/
  accounts/   # user auth (JWT)
  voting/     # feature requests + votes
frontend/
  src/
    pages/      # route-level components
    components/ # shared UI
    hooks/      # useXxx hooks (state + side effects)
    services/   # API calls (api.ts + domain services)
    ui/         # design system primitives
docs/
  api-voting.md    # Voting API reference
  api-patterns.md  # HTTP client, service, hook conventions
  ui-lib.md        # UI component library reference
```

## API

Base path: `/api/`

- `POST /api/auth/token/` — obtain JWT (username + password)
- `POST /api/auth/token/refresh/` — refresh access token
- `GET /api/voting/feature-requests/` — list (paginated, sortable, searchable)
- `POST /api/voting/feature-requests/` — create
- `GET /api/voting/feature-requests/{id}/` — retrieve
- `PATCH /api/voting/feature-requests/{id}/` — update (owner only)
- `DELETE /api/voting/feature-requests/{id}/` — delete (owner only)
- `POST /api/voting/feature-requests/{id}/vote/` — upvote
- `DELETE /api/voting/feature-requests/{id}/vote/` — remove vote

All endpoints require `Authorization: Bearer <access>`. Full reference: [`docs/api-voting.md`](docs/api-voting.md).

## Frontend Conventions

Data flow: `Component → hook → service → api.ts → Django REST`.

- Hooks own state + side effects. Expose `isPending`, `error`, action fn.
- Services are pure data — no React, no state. One file per domain.
- UI components live in `src/ui/`. Import from `@/ui`. No hardcoded colors — use Tailwind tokens (`bg-accent`, `text-muted`, etc.).

Full reference: [`docs/api-patterns.md`](docs/api-patterns.md) · [`docs/ui-lib.md`](docs/ui-lib.md).
