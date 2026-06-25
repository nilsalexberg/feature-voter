# Project Rules
## Prompt Logging
Every time you receive a new instruction or prompt, append it to prompts.txt in the project root with a timestamp (ISO 8601) and a brief summary of what you did in response. Create the file if it doesn't exist. Keep this log updated throughout all sessions.

## Project Scope
Build system for feature requests. Web and mobile. Must scale.
Core actions:
- User submit request (title + description).
- User view list of requests.
- User upvote requests.
- System show vote count. Rank by popularity.

## Project Structure
- `backend/`: Django project (poetry).
- `frontend/`: React project (pnpm).
- `docs/`: Markdown files for documentation.

## UI Library
Use `frontend/src/ui/` for all UI components. Import from `@/ui`.

- New primitives → add to `src/ui/` and export from `src/ui/index.ts`.
- No hardcoded colors/fonts — use Tailwind tokens (`bg-accent`, `text-muted`, etc.) from `src/index.css @theme`.
- Ref: `docs/ui-lib.md`.
