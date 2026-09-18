# Study with Dodo

A full-stack study planner and tracker for university students, built to learn modern web development end-to-end — real authentication, a real relational database, server-enforced authorization, engineering tradeoffs

## What it does

- **Courses** — track your enrolled courses (code, name, description); archive finished courses preserving historical data 
- **Assignments** — track assignments per course with priority, due dates, and estimated hours; mark complete and record actual time spent
- **Study sessions** — log study time either retroactively or with a live start/stop timer; optionally attribute a session to a specific assignment, which feeds a real "time spent so far / remaining" calculation
- **Dashboard** — a summary view of upcoming workload, completed work, and total time studied
- **Accounts** — sign up, log in, log out, with real sessions and rate limited login attempts
- **Private by default** — each user only ever sees their own courses and assignments, enforced at the database level vis Row Level Security, not just hidden in the UI


## Tech stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** — PostgreSQL database + authentication
- **Zod** for server-side validation
- **Vercel** for deployment


## Architecture
Browser (React Server Components + one Client Component: the live timer) 

↓

Next.js routes: / (dashboard), /courses, /assignments, /study-sessions, /login

↓

Server Actions (mutations) + Server Components (reads)

↓

Supabase client (auth-aware, cookie-based sessions)

↓

PostgreSQL (Row Level Security enforced per table/operation)


Data ownership is enforced with Postgres **Row Level Security** policies tied to `auth.uid()`, so authorization holds even if application code has a bug — the database itself refuses to return another user's rows.

## Getting started locally

```bash
npm install
```

Create a .env.local file (see .env.local.example) with your own Supabase project's values:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Then run:

```
npm run dev
```