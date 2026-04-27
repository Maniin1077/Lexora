
create table public.magazines (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text not null,
  description text not null,
  registration_link text not null,
  deadline timestamptz not null,
  tags text[] default '{}',
  posted_by uuid references auth.users(id) on delete set null,
  posted_by_email text,
  created_at timestamptz not null default now()
);

alter table public.magazines enable row level security;

create or replace function public.is_admin(_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where id = _user_id
      and lower(email) = 'bsmanikanta2004@gmail.com'
  )
$$;

create policy "Magazines are viewable by everyone"
  on public.magazines for select
  using (true);

create policy "Only admin can insert magazines"
  on public.magazines for insert
  to authenticated
  with check (public.is_admin(auth.uid()));

create policy "Only admin can update magazines"
  on public.magazines for update
  to authenticated
  using (public.is_admin(auth.uid()));

create policy "Only admin can delete magazines"
  on public.magazines for delete
  to authenticated
  using (public.is_admin(auth.uid()));

create index magazines_deadline_idx on public.magazines(deadline desc);
