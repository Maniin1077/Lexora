-- Shared tables for live website content and activity

create table if not exists public.internships (
  id text primary key,
  title text not null,
  organization text not null,
  description text not null,
  registration_link text not null,
  deadline timestamptz not null,
  tags text[] null,
  posted_by_email text null,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id text primary key,
  name text not null,
  image text not null,
  role text not null check (role in ('founder', 'core')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  target_email text null,
  title text not null,
  message text not null,
  sender_email text not null,
  created_at timestamptz not null default now(),
  read_by text[] not null default '{}'::text[]
);

create table if not exists public.change_logs (
  id text primary key,
  actor_email text not null,
  actor_role text not null check (actor_role in ('owner', 'admin')),
  action text not null,
  target text not null,
  detail text null,
  created_at timestamptz not null default now()
);

create table if not exists public.applications (
  id bigserial primary key,
  email text not null,
  item_id text not null,
  title text not null,
  organization text not null,
  applied_at timestamptz not null,
  link text not null,
  kind text not null check (kind in ('internship', 'magazine')),
  deadline timestamptz null,
  unique (email, item_id, kind)
);

create table if not exists public.site_content (
  content_key text primary key,
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.user_profiles (
  id text primary key,
  first_name text not null,
  last_name text not null,
  course text not null,
  institute text not null,
  email text not null unique,
  password text not null,
  security_question text not null default '',
  security_answer text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  email text primary key,
  role text not null check (role in ('owner', 'admin'))
);
