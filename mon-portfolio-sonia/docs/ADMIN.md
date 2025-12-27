# Admin credentials & seed instructions

These credentials are used for the admin interface. **Do not commit these in public repos**; they are included here for the assignment deliverable only.

- Admin email: admin@sonia.dev
- Admin password: T1d3JTNGGaEnMj90Sonia

How to run backend and access admin:

```bash
cd backend
npm install
# ensure backend/.env contains MONGO_URI and other vars
npm run dev
```

Open admin login: `http://localhost:5173/admin/secure-login` (frontend) then use the credentials above.

Seeding sample data (optional)
- Create a small script `backend/scripts/seed.ts` that inserts sample `Skill`, `Project`, `Experience` documents using Mongoose.
- Or use the admin UI to add sample projects and skills.

Security note: After submission, rotate or revoke these credentials if they are real.
