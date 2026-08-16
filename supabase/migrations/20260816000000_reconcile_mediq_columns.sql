-- Reconcile columns expected by the MediQ client with an existing database.
-- This migration is safe to run against databases where the columns already exist.

alter table if exists public.profiles
  add column if not exists age integer,
  add column if not exists gender text default 'Not specified';

alter table if exists public.beds
  add column if not exists hospital_id uuid references public.hospitals(id) on delete set null;

create index if not exists idx_beds_hospital_id on public.beds(hospital_id);

-- The trigger function references age and gender, so recreate it after the
-- columns are guaranteed to exist. This also repairs databases where the
-- original migration was only partially applied.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, phone, role, age, gender, blood_group, address)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'Patient'),
    nullif(new.raw_user_meta_data->>'age', '')::int,
    coalesce(new.raw_user_meta_data->>'gender', 'Not specified'),
    nullif(new.raw_user_meta_data->>'bloodGroup', '')::blood_group_type,
    coalesce(new.raw_user_meta_data->>'address', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    grant select, insert, update, delete on public.beds to authenticated;
    grant select, insert, update, delete on public.profiles to authenticated;
  end if;
end
$$;

notify pgrst, 'reload schema';
