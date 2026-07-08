# CivicPulse — MP Constituency Development Intelligence Platform

## ⏱ BUILD CONSTRAINT
This is a 36-hour hackathon-style MVP build for a government demo. Speed and a working end-to-end loop matter more than completeness. DO NOT gold-plate any single feature. DO NOT add features not listed below. If something is ambiguous, choose the simplest implementation that works and move on.

---

## 1. Problem Statement
MPs receive development requests through public meetings, letters, social media, grievance portals, and direct representations, while local development plans contain dozens of competing proposed projects. There is no objective way to consolidate citizen feedback, spot recurring needs, and weigh competing proposals against real demand (e.g. comparing requests for school upgrades against enrollment/travel-distance data vs. a proposed vocational centre).

## 2. What We're Building (MVP Scope Only)
A platform where:
1. A citizen submits a development request (text + optional photo + location).
2. AI (Claude API) auto-translates, categorizes, summarizes, and assigns a draft priority score to the submission.
3. An MP-staff admin dashboard shows all submissions on a map, grouped into recurring themes, with counts and priority ranking.
4. For ONE demo theme (schools), we show submissions side-by-side with one real public dataset (enrollment numbers) to prove the "citizen demand vs. real data" concept.

### Explicitly OUT of scope for this build (do not build these now):
- WhatsApp/SMS/social media ingestion
- Voice submissions (nice-to-have stretch only if time remains)
- Multi-constituency support (hardcode ONE constituency/region)
- Complex ML ranking models (a simple weighted formula is enough)
- Notifications, emails, SMS alerts
- Multi-language UI (backend translation of submissions is enough; UI can stay in English)

---

## 3. User Roles
- **citizen**: signs up, submits requests, views status of own submissions
- **admin** (MP staff): views dashboard, map, themes, rankings, can change submission status

Keep auth simple: Supabase Auth with email/password. Role stored on the `users`/`profiles` table. No need for complex permission systems — a simple `role` check (`admin` vs `citizen`) in the UI and in Supabase Row Level Security (RLS) policies is enough.

---

## 4. Tech Stack (fixed — do not deviate)
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend/DB/Auth/Storage:** Supabase (Postgres, Auth, Storage, Edge Functions)
- **AI:** Anthropic Claude API (translation, categorization, summarization, priority scoring)
- **Maps:** Mapbox GL JS (or Google Maps if Mapbox key unavailable)
- **Hosting:** Vercel (frontend), Supabase Cloud (backend)
- **Charts:** Recharts (for the admin dashboard's category/volume charts)

---

## 5. Database Schema

```sql
-- profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  phone text,
  role text default 'citizen' check (role in ('citizen','admin')),
  created_at timestamp with time zone default now()
);

-- submissions
create table submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  title text not null,
  description text not null,
  language text,
  translated_text text,
  category text, -- e.g. 'education','roads','health','water','sanitation','other'
  ai_summary text,
  priority_score numeric default 0,
  photo_url text,
  latitude numeric,
  longitude numeric,
  ward text, -- simple area/ward identifier for the single constituency
  status text default 'new' check (status in ('new','under_review','planned','completed','rejected')),
  created_at timestamp with time zone default now()
);

-- themes (auto-created/matched by AI categorization, kept simple)
create table themes (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  submission_count int default 0,
  avg_priority numeric default 0
);

-- link table
create table submission_themes (
  submission_id uuid references submissions(id),
  theme_id uuid references themes(id),
  primary key (submission_id, theme_id)
);

-- one public dataset table, kept simple, just for the schools demo
create table datasets (
  id uuid primary key default gen_random_uuid(),
  ward text,
  metric_name text, -- e.g. 'school_enrollment', 'avg_travel_distance_km'
  metric_value numeric,
  source text,
  updated_at timestamp with time zone default now()
);
```

RLS: citizens can insert/select their own submissions; admins can select/update all. Keep policies simple — correctness over sophistication.

---

## 6. AI Processing Pipeline
On new submission insert, call Claude API once with a single prompt that returns JSON:
```
Input: title, description (any language)
Output JSON: {
  "language_detected": "...",
  "translated_text": "...",      // English
  "category": "...",             // one of: education, roads, health, water, sanitation, other
  "ai_summary": "...",           // 1 sentence
  "priority_score": 0-100        // based on urgency/severity language used
}
```
Trigger this via a Supabase Edge Function (or a Next.js API route called right after insert — simpler for 36hrs, use this instead of Edge Functions if time-constrained).

Priority score refinement (simple, no ML): 
`final_score = ai_priority_score * 0.5 + (submission_count_in_same_theme_and_ward * 10) * 0.5`
This is enough to demonstrate "recurring demand" weighting.

---

## 7. Pages / Screens Needed

### Public / Citizen
- `/` — Landing page explaining the platform (short, professional, government-appropriate tone)
- `/signup`, `/login`
- `/submit` — submission form: title, description, category (optional, AI can override), photo upload, location picker (map click or use browser geolocation), ward dropdown
- `/my-submissions` — citizen's own list + status

### Admin
- `/admin/dashboard` — overview: total submissions, category breakdown chart, top 5 themes by count
- `/admin/map` — Mapbox map, pins colored by category, click pin to see submission detail
- `/admin/themes` — table of themes sorted by (count × avg priority), expandable to see submissions
- `/admin/compare` — the key demo screen: for the "education" theme, show submission count + map cluster in a ward SIDE BY SIDE with the `datasets` table's enrollment/travel-distance numbers for that ward, with a one-line auto-generated recommendation (can be a simple template, not AI-generated, e.g. "X submissions requesting school upgrades in Ward Y, where enrollment grew Z% and average travel distance is W km — higher demand signal than Vocational Centre proposal (N submissions).")

---

## 8. Seed Data (do this early — don't wait for real citizen submissions to test)
Write a seed script that inserts ~30-40 fake submissions across 4-5 categories and 3-4 wards, with realistic Hindi/English mixed text for a couple of them (to demo translation), plus 4-6 rows in `datasets` for school enrollment and travel distance per ward. This is CRITICAL — build this in parallel with the UI so you always have something to demo.

---

## 9. Build Order (36-hour plan)

**Hours 0–4: Foundation**
- Next.js + Tailwind scaffold, Supabase project created, schema migrated, .env set up
- Auth working: signup/login, role field, protected admin routes

**Hours 4–10: Submission flow**
- `/submit` form working end-to-end: inserts into `submissions`, uploads photo to Supabase Storage, captures lat/long
- Seed script written and run (don't skip this)

**Hours 10–18: AI pipeline**
- API route that calls Claude on new submission, updates row with translation/category/summary/priority
- Backfill seed data through this pipeline

**Hours 18–26: Admin dashboard + map**
- `/admin/dashboard` with charts (Recharts)
- `/admin/map` with Mapbox pins

**Hours 26–32: Themes + Compare screen**
- `/admin/themes` table view
- `/admin/compare` — the signature "demand vs data" screen. This is the single most important screen for the government pitch — protect time for this.

**Hours 32–36: Polish + deploy**
- Deploy to Vercel, test full flow end-to-end as both a citizen and an admin
- Landing page copy pass — make it look and read like a serious government-facing product, not a hackathon project
- Prepare a 2-minute walkthrough script for the demo

---

## 10. Non-negotiable Quality Bar (even in 36 hrs)
- No broken flows: every screen listed above must fully work by hour 36, not "mostly work"
- Real seed data must be visible everywhere (never demo an empty state)
- Landing page and admin dashboard must look professional (clean Tailwind UI, no default styling, no lorem ipsum)
- The `/admin/compare` screen must clearly and concretely make the core pitch of the whole project — this is what sells it

---

## 11. First Prompt to Give Cursor
"Using this PROJECT.md as the spec, scaffold a Next.js 14 app with TypeScript and Tailwind CSS, set up the Supabase client, and create the database schema and RLS policies described in section 5 as a SQL migration file. Then set up Supabase Auth with email/password and a `profiles` table trigger that creates a profile row with default role 'citizen' on signup."
