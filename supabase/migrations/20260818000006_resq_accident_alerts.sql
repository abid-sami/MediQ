create table if not exists public.resq_accident_alerts (
  id uuid primary key default gen_random_uuid(),
  alert_id text unique not null,
  vehicle_id text not null,
  vehicle_plate text default '',
  driver_name text default '',
  driver_phone text default '',
  severity text not null default 'High',
  impact_type text default 'Collision',
  location text not null,
  latitude numeric,
  longitude numeric,
  occupants integer not null default 1,
  injuries integer not null default 0,
  fire_risk boolean not null default false,
  medical_assistance_needed boolean not null default true,
  status text not null default 'New' check (status in ('New', 'Acknowledged', 'Dispatched', 'Resolved')),
  created_at timestamptz not null default now()
);

create index if not exists idx_resq_alerts_created_at on public.resq_accident_alerts(created_at desc);
create index if not exists idx_resq_alerts_status on public.resq_accident_alerts(status);

alter table public.resq_accident_alerts enable row level security;
grant usage on schema public to authenticated;
grant select, insert, update on table public.resq_accident_alerts to authenticated;

drop policy if exists "authenticated_read_resq_accident_alerts" on public.resq_accident_alerts;
create policy "authenticated_read_resq_accident_alerts"
on public.resq_accident_alerts for select to authenticated
using (auth.role() = 'authenticated');

drop policy if exists "authenticated_write_resq_accident_alerts" on public.resq_accident_alerts;
create policy "authenticated_write_resq_accident_alerts"
on public.resq_accident_alerts for insert to authenticated
with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_update_resq_accident_alerts" on public.resq_accident_alerts;
create policy "authenticated_update_resq_accident_alerts"
on public.resq_accident_alerts for update to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
