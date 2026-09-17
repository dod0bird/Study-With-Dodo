# Study with Dodo

A full-stack study planner and tracker for university students, built to learn modern web development end-to-end — real authentication, a real relational database, and server-enforced authorization

## What it does

- **Courses** — track your enrolled courses (code, name, description)
- **Assignments** — track assignments per course, with priority and status
- **Accounts** — sign up, log in, log out, with real sessions
- **Private by default** — each user only ever sees their own courses and assignments, enforced at the database level, not just hidden in the UI

## Tech stack

- **Next.js** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** for styling
- **Supabase** — PostgreSQL database + authentication
- **Vercel** for deployment

## Architecture
- Browser (React components)
- Next.js (Server Components, Server Actions, middleware)
- Supabase client (auth-aware, cookie-based sessions)
- PostgreSQL (courses, assignments — Row Level Security enforced)


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