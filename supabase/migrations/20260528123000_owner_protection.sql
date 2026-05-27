-- Hard owner/admin protection at the database layer.

create table if not exists public.owner_control (
  id integer primary key default 1 check (id = 1),
  protected_owner_email text not null default 'bsmanikanta2004@gmail.com'
);

insert into public.owner_control (id, protected_owner_email)
values (1, 'bsmanikanta2004@gmail.com')
on conflict (id) do nothing;

alter table public.user_roles enable row level security;

create policy "User roles are readable by everyone"
  on public.user_roles
  for select
  using (true);

create policy "Block direct role writes"
  on public.user_roles
  for insert
  to anon, authenticated
  with check (false);

create policy "Block direct role updates"
  on public.user_roles
  for update
  to anon, authenticated
  using (false)
  with check (false);

create policy "Block direct role deletes"
  on public.user_roles
  for delete
  to anon, authenticated
  using (false);

alter table public.owner_control enable row level security;

create policy "Owner control is readable by everyone"
  on public.owner_control
  for select
  using (true);

create or replace function public.normalize_email(value text)
returns text
language sql
immutable
as $$
  select lower(trim(value));
$$;

create or replace function public.is_protected_owner_email(value text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.normalize_email(value) = (
    select public.normalize_email(protected_owner_email)
    from public.owner_control
    where id = 1
  );
$$;

create or replace function public.is_owner_email(value text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_protected_owner_email(value)
    or exists (
      select 1
      from public.user_roles
      where public.normalize_email(email) = public.normalize_email(value)
        and role = 'owner'
    );
$$;

create or replace function public.is_admin_email(value text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_owner_email(value)
    or exists (
      select 1
      from public.user_roles
      where public.normalize_email(email) = public.normalize_email(value)
        and role = 'admin'
    );
$$;

create or replace function public.verify_profile_password(value_email text, value_password text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_profiles
    where public.normalize_email(email) = public.normalize_email(value_email)
      and password = value_password
  );
$$;

create or replace function public.change_user_email(
  actor_email text,
  actor_password text,
  new_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_actor_email text := public.normalize_email(actor_email);
  normalized_new_email text := public.normalize_email(new_email);
  existing_role text;
  protected_email text;
begin
  if normalized_actor_email is null or normalized_actor_email = '' then
    raise exception 'Actor email is required.';
  end if;

  if normalized_new_email is null or normalized_new_email = '' then
    raise exception 'New email is required.';
  end if;

  if not public.verify_profile_password(normalized_actor_email, actor_password) then
    raise exception 'Current password is incorrect.';
  end if;

  if exists (
    select 1 from public.user_profiles where public.normalize_email(email) = normalized_new_email
  ) then
    raise exception 'An account with this email already exists.';
  end if;

  select role
  into existing_role
  from public.user_roles
  where public.normalize_email(email) = normalized_actor_email
  limit 1;

  select public.normalize_email(protected_owner_email)
  into protected_email
  from public.owner_control
  where id = 1;

  update public.user_profiles
  set email = normalized_new_email
  where public.normalize_email(email) = normalized_actor_email;

  delete from public.user_roles where public.normalize_email(email) = normalized_actor_email;

  if existing_role = 'owner' then
    insert into public.user_roles (email, role)
    values (normalized_new_email, 'owner')
    on conflict (email) do update set role = excluded.role;

    if protected_email = normalized_actor_email then
      update public.owner_control
      set protected_owner_email = normalized_new_email
      where id = 1;
    end if;
  elsif existing_role = 'admin' then
    insert into public.user_roles (email, role)
    values (normalized_new_email, 'admin')
    on conflict (email) do update set role = excluded.role;
  end if;
end;
$$;

create or replace function public.grant_owner_access(
  actor_email text,
  actor_password text,
  target_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_actor_email text := public.normalize_email(actor_email);
  normalized_target_email text := public.normalize_email(target_email);
begin
  if not public.verify_profile_password(normalized_actor_email, actor_password) then
    raise exception 'Current password is incorrect.';
  end if;

  if not public.is_owner_email(normalized_actor_email) then
    raise exception 'Only existing owners can grant owner access.';
  end if;

  if normalized_target_email = '' then
    raise exception 'Please provide a valid email address.';
  end if;

  if not exists (
    select 1 from public.user_profiles where public.normalize_email(email) = normalized_target_email
  ) then
    raise exception 'Only registered users can be granted elevated access.';
  end if;

  insert into public.user_roles (email, role)
  values (normalized_target_email, 'owner')
  on conflict (email) do update set role = excluded.role;
end;
$$;

create or replace function public.revoke_owner_access(
  actor_email text,
  actor_password text,
  target_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_actor_email text := public.normalize_email(actor_email);
  normalized_target_email text := public.normalize_email(target_email);
  protected_email text;
begin
  if not public.verify_profile_password(normalized_actor_email, actor_password) then
    raise exception 'Current password is incorrect.';
  end if;

  if not public.is_owner_email(normalized_actor_email) then
    raise exception 'Only existing owners can revoke owner access.';
  end if;

  select public.normalize_email(protected_owner_email)
  into protected_email
  from public.owner_control
  where id = 1;

  if protected_email = normalized_target_email and normalized_actor_email <> normalized_target_email then
    raise exception 'The protected owner can only dismiss their own owner access.';
  end if;

  if protected_email = normalized_target_email and normalized_actor_email = normalized_target_email then
    delete from public.user_roles where public.normalize_email(email) = normalized_target_email and role = 'owner';
    return;
  end if;

  delete from public.user_roles where public.normalize_email(email) = normalized_target_email and role = 'owner';
end;
$$;

create or replace function public.grant_admin_access(
  actor_email text,
  actor_password text,
  target_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_actor_email text := public.normalize_email(actor_email);
  normalized_target_email text := public.normalize_email(target_email);
begin
  if not public.verify_profile_password(normalized_actor_email, actor_password) then
    raise exception 'Current password is incorrect.';
  end if;

  if not public.is_owner_email(normalized_actor_email) then
    raise exception 'Only existing owners can grant admin access.';
  end if;

  if normalized_target_email = '' then
    raise exception 'Please provide a valid email address.';
  end if;

  if public.is_owner_email(normalized_target_email) then
    raise exception 'Owner already has full access.';
  end if;

  if not exists (
    select 1 from public.user_profiles where public.normalize_email(email) = normalized_target_email
  ) then
    raise exception 'Only registered users can be granted elevated access.';
  end if;

  insert into public.user_roles (email, role)
  values (normalized_target_email, 'admin')
  on conflict (email) do update set role = excluded.role;
end;
$$;

create or replace function public.revoke_admin_access(
  actor_email text,
  actor_password text,
  target_email text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_actor_email text := public.normalize_email(actor_email);
  normalized_target_email text := public.normalize_email(target_email);
begin
  if not public.verify_profile_password(normalized_actor_email, actor_password) then
    raise exception 'Current password is incorrect.';
  end if;

  if not public.is_owner_email(normalized_actor_email) then
    raise exception 'Only existing owners can revoke admin access.';
  end if;

  if normalized_target_email = '' then
    raise exception 'Please provide a valid email address.';
  end if;

  delete from public.user_roles where public.normalize_email(email) = normalized_target_email and role = 'admin';
end;
$$;
