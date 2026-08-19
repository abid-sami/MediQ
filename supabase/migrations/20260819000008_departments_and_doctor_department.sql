-- MediQ departments: durable, admin-governed clinical department catalogue.
-- Apply with `supabase db push` (or run in the linked Supabase SQL Editor).

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

create index if not exists idx_departments_name on public.departments(name);

alter table public.profiles add column if not exists department text;
create index if not exists idx_profiles_department on public.profiles(department) where department is not null;

create or replace function public.set_departments_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists departments_set_updated_at on public.departments;
create trigger departments_set_updated_at
  before update on public.departments
  for each row execute function public.set_departments_updated_at();

alter table public.departments enable row level security;

drop policy if exists "public_read_departments" on public.departments;
create policy "public_read_departments"
  on public.departments for select using (true);

drop policy if exists "super_admin_manage_departments" on public.departments;
drop policy if exists "department_admin_manage_departments" on public.departments;
create policy "department_admin_manage_departments"
  on public.departments for all
  using (
    exists (
      select 1 from public.profiles
      -- Cast to text so an older database using `Admin` rather than
      -- `Super Admin` does not fail while parsing this migration.
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
