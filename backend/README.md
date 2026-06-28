# SkillBridge Backend

Express + Prisma + PostgreSQL + JWT + Zod.

## Setup
```bash
cp .env.example .env   # paste real Neon DATABASE_URL
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Server: `http://localhost:5000`

## Modules
- `auth` — POST /api/auth/register, /login, GET /me
- `user` — PATCH /api/users/me
- `tutor` — GET /api/tutors, GET /:id, PUT /me, GET /me/profile
- `booking` — POST /api/bookings, GET /me, PATCH /:id/status
- `review` — GET /api/reviews/tutor/:id, POST /api/reviews
- `admin` — GET /stats, /users, /bookings, PATCH /users/:id/block|unblock, DELETE /users/:id

## Roles
`STUDENT`, `TUTOR`, `ADMIN` (admin is seeded).

## Auth
Send `Authorization: Bearer <jwt>` from frontend.
