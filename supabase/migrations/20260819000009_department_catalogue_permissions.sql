-- Repair shared department catalogue access for installations where the
-- departments table was created before its final RLS policies and grants.

create extension if not exists "pgcrypto";

create table if not exists public.departments (
  id                    uuid primary key default gen_random_uuid(),
  name                  text not null,
  code                  text not null,
  head_of_department    text not null default '',
  description           text not null default '',
  created_by            uuid references public.profiles(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint departments_name_key unique (name),
  constraint departments_code_key unique (code)
);

alter table public.profiles add column if not exists department text;
create index if not exists idx_departments_name on public.departments(name);
create index if not exists idx_profiles_department on public.profiles(department) where department is not null;

grant usage on schema public to anon, authenticated;
grant select on table public.departments to anon, authenticated;
grant insert, update, delete on table public.departments to authenticated;

alter table public.departments enable row level security;

drop policy if exists "public_read_departments" on public.departments;
create policy "public_read_departments"
  on public.departments for select
  using (true);

drop policy if exists "super_admin_manage_departments" on public.departments;
drop policy if exists "department_admin_manage_departments" on public.departments;
create policy "department_admin_manage_departments"
  on public.departments for all
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role::text in ('Admin', 'Super Admin')
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
        and profiles.role::text in ('Admin', 'Super Admin')
    )
  );
