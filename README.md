# CivicPulse

Citizen demand intelligence for MP offices.

CivicPulse is a government-facing web app that helps constituency staff collect citizen development requests, cluster recurring issues, prioritize them with AI assistance, and compare public demand against reference datasets. Citizens can submit requests with optional photos and location data, while admins get a dashboard, map, theme views, export tools, and status workflows.

## Why It Exists

MP offices receive development requests through meetings, letters, local outreach, and informal channels, but those requests are hard to consolidate into a clear, evidence-based prioritization view. CivicPulse turns scattered complaints into a structured workflow:

- citizens submit issues in a simple form
- AI translates, categorizes, summarizes, and scores them
- admins see patterns across wards and recurring themes
- the compare view connects citizen demand with official ward-level reference data

## Core Features

### Citizen experience

- Email/password signup and login with Supabase Auth
- Submit a development request with:
  - title
  - description
  - optional category
  - ward
  - optional photo upload
  - browser geolocation
- Duplicate soft-check for similar submissions in the same ward/category in the last 7 days
- `/my-submissions` page with:
  - sorted submission history
  - status timeline
  - AI analysis card
  - photo lightbox
  - delete flow with confirmation

### Admin experience

- `/admin/dashboard`
  - total submissions
  - wards covered
  - new / under review / completed counts
  - category chart
  - top theme chart
  - CSV export
- `/admin/map`
  - Mapbox pins by category
  - submission popup
  - status updates
  - AI analysis card
  - photo lightbox
- `/admin/themes`
  - ranked recurring themes
  - expandable submission rows
  - status updates
  - AI analysis card
  - photo lightbox
- `/admin/submissions`
  - full submission list
  - filters by ward, category, and status
  - status updates
  - CSV export
- `/admin/compare`
  - education demand vs ward-level dataset metrics
  - recommendation summary
  - data freshness note from `datasets.updated_at`

### AI pipeline

- Uses Groq with `llama-3.3-70b-versatile`
- Detects language
- Translates content to English
- Assigns a category
- Generates an analytical AI summary
- Produces a priority score
- Supports backfilling seed/demo data

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
  - Auth
  - Postgres
  - Storage
- Groq API
- Mapbox GL
- Recharts
- Framer Motion

## Project Structure

```text
src/
  app/
    admin/
    api/
    login/
    my-submissions/
    signup/
    submit/
  components/
  lib/
  types/
scripts/
supabase/
  migrations/
```

## Environment Variables

Create a local env file based on `.env.local.example`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=
```

Notes:

- `SUPABASE_SERVICE_ROLE_KEY` and `GROQ_API_KEY` must stay server-side only
- the app uses a public Supabase Storage bucket for submission photos
- Mapbox is required for the admin map experience

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.local.example` into your local env setup and add real keys.

### 3. Run the database schema

Apply the SQL files in `supabase/migrations/` to your Supabase project.

Important: make sure the delete policy migration is also applied:

- `supabase/migrations/20260708100000_citizen_delete_submission.sql`

### 4. Start the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run dev
npm run build
npm run start
npm run seed
npm run backfill-ai
npm run backfill-ai:force
```

## Demo Data

Seed data is included so the app is not empty during demos.

Run:

```bash
npm run seed
```

Then backfill AI results if needed:

```bash
npm run backfill-ai
```

## Status Workflow

Submission statuses:

- `new`
- `under_review`
- `planned`
- `completed`
- `rejected`

Sorting behavior across admin and citizen views:

- active statuses first: `new`, `under_review`, `planned`
- inactive statuses last: `completed`, `rejected`
- within each group: higher `priority_score` first

## Deployment Notes

- Frontend target: Vercel
- Backend/data/auth/storage: Supabase
- Mapbox token must be present in production
- Supabase image host is configured in `next.config.mjs`
- Build output uses `next-dist` instead of `.next` to reduce Windows file lock issues during local development

## Security Notes

- Do not commit `.env`
- Do not expose the Supabase service role key
- Keep Groq API keys server-side only
- Admin access is controlled through the `profiles.role` field

## Current MVP Scope

This repository is intentionally focused on a single-constituency MVP for demo use:

- one constituency
- simple role model: citizen/admin
- one signature compare workflow for education demand
- no notifications, SMS, WhatsApp ingestion, or multi-constituency management

## Repository

GitHub: [aararvav/CivilPulse](https://github.com/aararvav/CivilPulse.git)

## License

This project is currently unlicensed/private for demo and hackathon use unless a separate license is added later.
