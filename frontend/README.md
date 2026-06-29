# SkillBridge Frontend

Next.js 14 (App Router) + TypeScript + Tailwind + TanStack Form + TanStack Query + Zod.

## Setup
```bash
cp .env.local.example .env.local
npm install
npm run dev
```
Open `http://localhost:3000`. Make sure backend is running at `http://localhost:5000`.

## Pages
- `/` — Homepage (Hero, Features, Subjects, How it works, CTA) + Navbar + Footer
- `/auth/login`, `/auth/register` — Auth (TanStack Form + Zod)
- `/tutors`, `/tutors/[id]` — Browse & book tutors
- `/dashboard/student` — bookings + reviews
- `/dashboard/tutor` — profile + booking requests
- `/dashboard/admin` — stats, users, bookings (admin only)
