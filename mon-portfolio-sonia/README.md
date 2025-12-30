# Portfolio Project — Sokhna Ndione

This repository contains a full-stack portfolio application (frontend + backend) built with React (Vite/TypeScript) and Node/Express + MongoDB.

## Quick start (development)

1. Clone repository

```bash
git clone <your-repo-url>
cd mon-portfolio-sonia
```

2. Backend

```bash
cd backend
cp .env.example .env    # or create .env from template
npm install
npm run dev
```

3. Frontend

```bash
# from repo root
npm install
npm run dev
# open http://localhost:5173
```

## Environment variables (backend/.env)
Provide values in `backend/.env`. Minimal:

```
MONGO_URI=...
PORT=5000
ADMIN_EMAIL=admin@sonia.dev
ADMIN_PASSWORD=...            # admin login
JWT_SECRET=...
SMTP_HOST=smtp.example.com    # or leave blank to use Ethereal dev preview
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=app_password_here
CONTACT_TO=you@example.com
```

> Do NOT commit `backend/.env` to git. Use platform secrets for production.

## How contact emails work
- If SMTP credentials are configured, the server attempts to send via SMTP (authenticated user as From + Reply-To set to applicant).
- If SMTP fails or is not configured, the server sends via Ethereal and returns a preview URL in the API response (useful for development).

## Deliverables checklist (what to submit)
- Git repo link (this repo)
- UML diagrams (use-case diagram for `visitor` and `admin`) — see `docs/diagrams/`
- Database diagrams (MCD/MLD/MPD) — see `docs/diagrams/`
- Admin credentials and instructions — see `docs/ADMIN.md`
- README (this file) with installation & run instructions
- Ensure filenames include your first and last name (see `docs/FILENAME_RULES.md`)

## Notes
- To seed test data, add a script in `backend/scripts/seed.js` or manually POST via admin UI.
- For production email, prefer a dedicated SMTP provider (Mailgun, SendGrid) or OAuth2 for Gmail.


---

If you want, I can generate the seed script and a small `docs/diagrams/*` SVG from mermaid files.
