-- Create magazines table
create table if not exists public.magazines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  description text not null,
  registration_link text not null,
  deadline timestamptz not null,
  tags text[] default null,
  posted_by uuid null,
  posted_by_email text null,
  created_at timestamptz default now()
);

-- Optional: grant read access to anon role for public reads
-- grant select on public.magazines to anon;
