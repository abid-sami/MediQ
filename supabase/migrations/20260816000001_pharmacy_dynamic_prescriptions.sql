-- Make pharmacy inventory compatible with the client and expose a persistent
-- prescription upload and pharmacist verification workflow.

alter table if exists public.pharmacy_inventory
  add column if not exists prescription_required boolean not null default true,
  add column if not exists expiry_date date;

-- The original schema requires medicine_code, while the client previously
-- attempted to insert a client-generated id and omitted this field.
update public.pharmacy_inventory
set medicine_code = coalesce(nullif(medicine_code, ''), 'MED-' || upper(substr(replace(id::text, '-', ''), 1, 10)))
where medicine_code is null or medicine_code = '';

alter table if exists public.pharmacy_inventory
  alter column medicine_code set default ('MED-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10)));

alter table if exists public.pharmacy_orders
  add column if not exists prescription_required boolean not null default false,
  add column if not exists delivery_type text not null default 'Home Delivery',
  add column if not exists prescription_file_name text,
  add column if not exists prescription_file_url text;

create table if not exists public.prescription_submissions (
  id                 uuid primary key default gen_random_uuid(),
  prescription_id    text unique not null,
  order_id           uuid references public.pharmacy_orders(id) on delete cascade,
  order_reference    text,
  patient_id         uuid references public.profiles(id) on delete set null,
  patient_name       text not null default '',
  file_name          text not null,
  file_path          text not null,
  file_url           text,
  mime_type          text not null default 'application/octet-stream',
  file_size          bigint,
  notes              text default '',
  verification_status text not null default 'Pending'
                     check (verification_status in ('Pending', 'Verified', 'Rejected', 'Clarification Requested')),
  pharmacist_notes   text,
  reviewed_by       uuid references public.profiles(id) on delete set null,
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now()
);

create index if not exists idx_prescription_submissions_status on public.prescription_submissions(verification_status);
create index if not exists idx_prescription_submissions_order on public.prescription_submissions(order_id);

insert into storage.buckets (id, name, public)
values ('prescriptions', 'prescriptions', true)
on conflict (id) do update set public = true;

alter table public.prescription_submissions enable row level security;

drop policy if exists "Authenticated users can read prescription submissions" on public.prescription_submissions;
create policy "Authenticated users can read prescription submissions"
  on public.prescription_submissions for select to authenticated using (true);

drop policy if exists "Authenticated users can create prescription submissions" on public.prescription_submissions;
create policy "Authenticated users can create prescription submissions"
  on public.prescription_submissions for insert to authenticated with check (true);

drop policy if exists "Authenticated users can update prescription submissions" on public.prescription_submissions;
create policy "Authenticated users can update prescription submissions"
  on public.prescription_submissions for update to authenticated using (true) with check (true);

drop policy if exists "Authenticated users can upload prescriptions" on storage.objects;
create policy "Authenticated users can upload prescriptions"
  on storage.objects for insert to authenticated with check (bucket_id = 'prescriptions');

drop policy if exists "Authenticated users can read prescriptions" on storage.objects;
create policy "Authenticated users can read prescriptions"
  on storage.objects for select to authenticated using (bucket_id = 'prescriptions');

drop policy if exists "Public can read prescription previews" on storage.objects;
create policy "Public can read prescription previews"
  on storage.objects for select to anon, authenticated using (bucket_id = 'prescriptions');

drop policy if exists "Authenticated users can delete prescriptions" on storage.objects;
create policy "Authenticated users can delete prescriptions"
  on storage.objects for delete to authenticated using (bucket_id = 'prescriptions');

notify pgrst, 'reload schema';
