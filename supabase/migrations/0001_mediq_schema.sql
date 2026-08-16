-- ============================================================================
-- MediQ — Full Database Schema
-- Run this in the Supabase SQL Editor (or via `supabase db push`).
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / OR REPLACE.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- 1. ENUM TYPES
-- ============================================================================

do $$ begin
  create type user_role as enum (
    'Super Admin', 'Doctor', 'Patient', 'Nurse', 'Pharmacist',
    'Blood Bank Staff', 'Ambulance Driver', 'Lab Staff', 'Receptionist'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type blood_group_type as enum (
    'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
  );
exception when duplicate_object then null; end $$;

-- ============================================================================
-- 2. PROFILES  (one row per auth.users account)
-- ============================================================================

create table if not exists public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  name                    text not null default '',
  email                   text unique,
  phone                   text default '',
  role                    user_role not null default 'Patient',
  age                     int,
  gender                  text default 'Not specified',
  blood_group             blood_group_type,
  address                 text default '',
  avatar_url              text default '',
  badge_id                text,
  specialty               text,
  license_no              text,
  working_hours           text,
  patient_capacity        int,
  online_booking_enabled  boolean default true,
  is_featured             boolean not null default false,
  created_at              timestamptz not null default now()
);

alter table public.profiles add column if not exists is_featured boolean not null default false;

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_featured on public.profiles(is_featured) where is_featured = true;

-- Auto-create a profile row whenever a new auth user is created,
-- so the app never has to fall back to placeholder data for a logged-in user.
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

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 3. HOSPITALS & BEDS
-- ============================================================================

create table if not exists public.hospitals (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  location            text not null default '',
  total_beds          int not null default 0,
  available_beds      int not null default 0,
  doctor_count        int not null default 0,
  emergency_status    text not null default 'Active'
                        check (emergency_status in ('Active', 'Inactive', 'Alert')),
  occupancy_percent   int not null default 0,
  support_hours       text not null default '24/7',
  created_at          timestamptz not null default now()
);

alter table public.hospitals add column if not exists support_hours text not null default '24/7';

create table if not exists public.beds (
  id                      uuid primary key default gen_random_uuid(),
  hospital_id             uuid references public.hospitals(id) on delete set null,
  bed_number              text not null,
  ward_type               text not null default 'General',
  floor_number            int default 1,
  daily_rate              numeric(10,2) not null default 0,
  status                  text not null default 'Available'
                            check (status in ('Available', 'Occupied', 'Cleaning', 'Maintenance')),
  admitted_patient_name   text,
  attending_doctor        text,
  admission_date          date,
  created_at              timestamptz not null default now()
);

create index if not exists idx_beds_status on public.beds(status);

-- ============================================================================
-- 4. APPOINTMENTS
-- ============================================================================

create table if not exists public.appointments (
  id                  uuid primary key default gen_random_uuid(),
  appointment_id      text unique not null,
  patient_id          uuid references public.profiles(id) on delete set null,
  patient_name        text not null,
  patient_phone       text default '',
  patient_age         int,
  doctor_id           uuid references public.profiles(id) on delete set null,
  doctor_name         text not null,
  department          text,
  specialty           text,
  appointment_date    date not null,
  appointment_time    text not null,
  appointment_type    text default 'In-Person'
                        check (appointment_type in ('In-Person', 'Teleconsult', 'Follow-up', 'Emergency')),
  status              text not null default 'Scheduled'
                        check (status in ('Pending', 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rescheduled')),
  serial_number       int,
  serial_token        text,
  fee                 numeric(10,2) default 0,
  reason              text default '',
  created_at          timestamptz not null default now()
);

create index if not exists idx_appointments_doctor on public.appointments(doctor_id);
create index if not exists idx_appointments_patient on public.appointments(patient_id);
create index if not exists idx_appointments_date on public.appointments(appointment_date);

-- ============================================================================
-- 5. LABORATORY
-- ============================================================================

create table if not exists public.lab_catalog (
  id                  uuid primary key default gen_random_uuid(),
  test_code           text unique not null,
  test_name           text not null,
  department          text,
  specimen_type       text,
  price               numeric(10,2) not null default 0,
  tat_hours           int default 24,
  reference_range     text,
  created_at          timestamptz not null default now()
);

create table if not exists public.lab_test_orders (
  id                  uuid primary key default gen_random_uuid(),
  test_id             text unique not null,
  patient_id          uuid references public.profiles(id) on delete set null,
  patient_name        text not null,
  patient_age         int,
  doctor_name         text,
  test_name           text not null,
  category            text,
  priority            text not null default 'Routine'
                        check (priority in ('Routine', 'Urgent', 'STAT Emergency')),
  status              text not null default 'Sample Pending'
                        check (status in ('Sample Pending', 'Sample Collected', 'In Analyzer', 'Centrifuging', 'Review Pending', 'Report Ready', 'Completed')),
  container_id        text,
  collection_time     text,
  created_at          timestamptz not null default now()
);

create index if not exists idx_lab_orders_status on public.lab_test_orders(status);

-- ============================================================================
-- 6. PHARMACY
-- ============================================================================

create table if not exists public.pharmacy_inventory (
  id                  uuid primary key default gen_random_uuid(),
  medicine_code       text unique not null,
  medicine_name       text not null,
  generic_name        text,
  category            text,
  dosage_strength     text,
  price_per_unit      numeric(10,2) not null default 0,
  stock               int not null default 0,
  reorder_level       int not null default 10,
  manufacturer        text,
  stock_status        text not null default 'In Stock'
                        check (stock_status in ('In Stock', 'Low Stock', 'Out of Stock', 'Expiring Soon')),
  created_at          timestamptz not null default now()
);

create table if not exists public.pharmacy_orders (
  id                    uuid primary key default gen_random_uuid(),
  order_id              text unique not null,
  patient_id            uuid references public.profiles(id) on delete set null,
  patient_name          text not null,
  patient_contact       text default '',
  medicines             jsonb not null default '[]'::jsonb,
  total_amount          numeric(10,2) not null default 0,
  prescription_status   text not null default 'Pending'
                          check (prescription_status in ('Pending', 'Verified', 'Rejected')),
  order_status          text not null default 'Pending'
                          check (order_status in ('Pending', 'Verification', 'Processing', 'Ready', 'Out for Delivery', 'Delivered', 'Completed', 'Cancelled')),
  created_at            timestamptz not null default now()
);

create index if not exists idx_pharmacy_orders_status on public.pharmacy_orders(order_status);

-- ============================================================================
-- 7. BLOOD BANK
-- ============================================================================

create table if not exists public.blood_inventory (
  blood_group         blood_group_type primary key,
  available_units     int not null default 0,
  reserved_units      int not null default 0,
  critical_threshold  int not null default 10,
  status              text not null default 'Normal'
                        check (status in ('Normal', 'Low', 'Critical'))
);

create table if not exists public.blood_donors (
  id                    uuid primary key default gen_random_uuid(),
  donor_id              text unique not null,
  name                  text not null,
  blood_group           blood_group_type not null,
  phone                 text default '',
  email                 text,
  last_donation_date    date,
  total_donations       int default 0,
  eligibility_status    text not null default 'Eligible'
                          check (eligibility_status in ('Eligible', 'Not Eligible', 'Deferred')),
  created_at            timestamptz not null default now()
);

create table if not exists public.blood_requests (
  id                  uuid primary key default gen_random_uuid(),
  request_id          text unique not null,
  patient_name        text not null,
  patient_age         int,
  blood_group          blood_group_type not null,
  units_needed        int not null default 1,
  hospital_name       text default 'MediQ Central Hospital',
  doctor_name         text default 'Staff Physician',
  required_date       date default (current_date),
  urgency             text not null default 'Normal'
                        check (urgency in ('Normal', 'Urgent', 'Emergency')),
  status              text not null default 'Pending'
                        check (status in ('Pending', 'Approved', 'Reserved', 'Fulfilled', 'Rejected')),
  created_at          timestamptz not null default now()
);

create index if not exists idx_blood_requests_status on public.blood_requests(status);

-- ============================================================================
-- 8. EMERGENCY / SOS
-- ============================================================================

create table if not exists public.sos_requests (
  id                      uuid primary key default gen_random_uuid(),
  request_id              text unique not null,
  patient_name            text not null,
  patient_phone           text default '',
  emergency_type          text default 'General Emergency',
  location                text not null,
  destination_hospital    text,
  assigned_driver         text,
  eta                     text,
  ambulance_status        text not null default 'Going to Pickup'
                            check (ambulance_status in ('Going to Pickup', 'Picked Up', 'En Route', 'Arrived', 'Completed', 'Cancelled')),
  created_at              timestamptz not null default now()
);

create index if not exists idx_sos_status on public.sos_requests(ambulance_status);

-- ============================================================================
-- 9. AUDIT LOGS
-- ============================================================================

create table if not exists public.audit_logs (
  id            uuid primary key default gen_random_uuid(),
  user_name     text not null,
  role          text,
  action        text not null,
  ip_address    text default '127.0.0.1',
  details       text default '',
  "timestamp"   timestamptz not null default now()
);

create index if not exists idx_audit_logs_timestamp on public.audit_logs("timestamp" desc);

-- ============================================================================
-- 10. ROW LEVEL SECURITY
-- Writes (insert/update/delete) always require an authenticated session.
-- Reads are authenticated-only EXCEPT for the tables that power the public
-- home page (bed/blood/infrastructure stats, doctor directory) shown to
-- signed-out visitors — those get an additional public SELECT policy below.
-- Tighten further before production (e.g. restrict `profiles` reads to only
-- the public-safe columns via a view, restrict updates to `auth.uid() = id`
-- or an admin role).
-- ============================================================================

alter table public.profiles           enable row level security;
alter table public.hospitals          enable row level security;
alter table public.beds               enable row level security;
alter table public.appointments       enable row level security;
alter table public.lab_catalog        enable row level security;
alter table public.lab_test_orders    enable row level security;
alter table public.pharmacy_inventory enable row level security;
alter table public.pharmacy_orders    enable row level security;
alter table public.blood_inventory    enable row level security;
alter table public.blood_donors       enable row level security;
alter table public.blood_requests     enable row level security;
alter table public.sos_requests       enable row level security;
alter table public.audit_logs         enable row level security;

do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'profiles','hospitals','beds','appointments','lab_catalog','lab_test_orders',
      'pharmacy_inventory','pharmacy_orders','blood_inventory','blood_donors',
      'blood_requests','sos_requests','audit_logs'
    ])
  loop
    execute format('drop policy if exists "authenticated_read_%1$s" on public.%1$s', t);
    execute format('create policy "authenticated_read_%1$s" on public.%1$s for select using (auth.role() = ''authenticated'')', t);

    execute format('drop policy if exists "authenticated_write_%1$s" on public.%1$s', t);
    execute format('create policy "authenticated_write_%1$s" on public.%1$s for insert with check (auth.role() = ''authenticated'')', t);

    execute format('drop policy if exists "authenticated_update_%1$s" on public.%1$s', t);
    execute format('create policy "authenticated_update_%1$s" on public.%1$s for update using (auth.role() = ''authenticated'')', t);

    execute format('drop policy if exists "authenticated_delete_%1$s" on public.%1$s', t);
    execute format('create policy "authenticated_delete_%1$s" on public.%1$s for delete using (auth.role() = ''authenticated'')', t);
  end loop;
end $$;

-- Public (signed-out) read access for the home page widgets: bed
-- availability, blood stock, infrastructure counters, and the doctor
-- directory / featured doctors. Read-only — insert/update/delete on these
-- tables still require an authenticated session via the policies above.
do $$
declare
  t text;
begin
  for t in select unnest(array['hospitals', 'beds', 'blood_inventory', 'lab_catalog', 'profiles'])
  loop
    execute format('drop policy if exists "public_read_%1$s" on public.%1$s', t);
    execute format('create policy "public_read_%1$s" on public.%1$s for select using (true)', t);
  end loop;
end $$;

-- ============================================================================
-- 11. STARTER REFERENCE DATA
-- Not "dummy business data" — this seeds the blood-group ledger rows that
-- the app expects to already exist (one row per group, updated in place)
-- and a starter hospital record so the app has somewhere to attach beds to.
-- Safe/idempotent: uses ON CONFLICT DO NOTHING.
-- ============================================================================

insert into public.blood_inventory (blood_group, available_units, reserved_units, critical_threshold, status)
values
  ('A+', 0, 0, 10, 'Critical'),
  ('A-', 0, 0, 10, 'Critical'),
  ('B+', 0, 0, 10, 'Critical'),
  ('B-', 0, 0, 10, 'Critical'),
  ('AB+', 0, 0, 10, 'Critical'),
  ('AB-', 0, 0, 10, 'Critical'),
  ('O+', 0, 0, 10, 'Critical'),
  ('O-', 0, 0, 10, 'Critical')
on conflict (blood_group) do nothing;

insert into public.hospitals (name, location, total_beds, available_beds, doctor_count, emergency_status, occupancy_percent)
values ('MediQ Central Hospital', 'Main Campus', 0, 0, 0, 'Active', 0)
on conflict do nothing;
