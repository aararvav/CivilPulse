-- CivicPulse initial schema, RLS policies, and auth trigger
-- Run this in the Supabase SQL Editor or via `supabase db push`

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  phone text,
  role text default 'citizen' check (role in ('citizen', 'admin')),
  created_at timestamptz default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  description text not null,
  language text,
  translated_text text,
  category text,
  ai_summary text,
  priority_score numeric default 0,
  photo_url text,
  latitude numeric,
  longitude numeric,
  ward text,
  status text default 'new' check (status in ('new', 'under_review', 'planned', 'completed', 'rejected')),
  created_at timestamptz default now()
);

create table public.themes (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  submission_count int default 0,
  avg_priority numeric default 0
);

create table public.submission_themes (
  submission_id uuid references public.submissions(id) on delete cascade,
  theme_id uuid references public.themes(id) on delete cascade,
  primary key (submission_id, theme_id)
);

create table public.datasets (
  id uuid primary key default gen_random_uuid(),
  ward text,
  metric_name text,
  metric_value numeric,
  source text,
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- Storage: submissions bucket (for request photos)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', true)
on conflict (id) do nothing;

create policy "Public read access for submissions images"
  on storage.objects for select
  using (bucket_id = 'submissions');

create policy "Authenticated users can upload submissions images"
  on storage.objects for insert
  with check (
    bucket_id = 'submissions'
    and auth.role() = 'authenticated'
  );

create policy "Users can update their own submissions images"
  on storage.objects for update
  using (bucket_id = 'submissions' and auth.role() = 'authenticated')
  with check (bucket_id = 'submissions' and auth.role() = 'authenticated');

create policy "Users can delete their own submissions images"
  on storage.objects for delete
  using (bucket_id = 'submissions' and auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index submissions_user_id_idx on public.submissions(user_id);
create index submissions_category_idx on public.submissions(category);
create index submissions_ward_idx on public.submissions(ward);
create index submissions_status_idx on public.submissions(status);
create index datasets_ward_idx on public.datasets(ward);

-- ---------------------------------------------------------------------------
-- Helper: check if current user is admin
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Auth trigger: create profile with default role 'citizen' on signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    'citizen'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;
alter table public.themes enable row level security;
alter table public.submission_themes enable row level security;
alter table public.datasets enable row level security;

-- profiles: users read/update own row; admins read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- submissions: citizens insert/select own; admins select/update all
create policy "Citizens can insert own submissions"
  on public.submissions for insert
  with check (auth.uid() = user_id);

create policy "Citizens can view own submissions"
  on public.submissions for select
  using (auth.uid() = user_id);

create policy "Admins can view all submissions"
  on public.submissions for select
  using (public.is_admin());

create policy "Admins can update all submissions"
  on public.submissions for update
  using (public.is_admin());

-- themes: admin-only read/write
create policy "Admins can view themes"
  on public.themes for select
  using (public.is_admin());

create policy "Admins can insert themes"
  on public.themes for insert
  with check (public.is_admin());

create policy "Admins can update themes"
  on public.themes for update
  using (public.is_admin());

-- submission_themes: citizens see links for own submissions; admins see all
create policy "Citizens can view own submission themes"
  on public.submission_themes for select
  using (
    exists (
      select 1 from public.submissions s
      where s.id = submission_id
        and s.user_id = auth.uid()
    )
  );

create policy "Admins can view all submission themes"
  on public.submission_themes for select
  using (public.is_admin());

create policy "Admins can manage submission themes"
  on public.submission_themes for all
  using (public.is_admin())
  with check (public.is_admin());

-- datasets: admin-only read
create policy "Admins can view datasets"
  on public.datasets for select
  using (public.is_admin());

create policy "Admins can manage datasets"
  on public.datasets for all
  using (public.is_admin())
  with check (public.is_admin());
