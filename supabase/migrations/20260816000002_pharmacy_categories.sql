-- Dynamic medicine categories managed by administrators.
create table if not exists public.pharmacy_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text unique not null,
  is_active   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

insert into public.pharmacy_categories (name, sort_order)
values
  ('Pain & Fever', 10),
  ('Cardiac & Hypertension', 20),
  ('Diabetes Care', 30),
  ('Antibiotics', 40),
  ('Gastrointestinal', 50),
  ('Respiratory', 60),
  ('Vitamins & Supplements', 70),
  ('Allergy & Cold', 80),
  ('Prescription Medicines', 90),
  ('OTC Medicines', 100)
on conflict (name) do nothing;

alter table public.pharmacy_categories enable row level security;

-- RLS policies do not replace PostgreSQL table privileges. Explicit grants are
-- required for the Supabase authenticated role to insert, update, and soft-delete categories.
grant usage on schema public to anon, authenticated;
grant select on public.pharmacy_categories to anon;
grant select, insert, update, delete on public.pharmacy_categories to authenticated;

drop policy if exists "authenticated_read_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_read_pharmacy_categories"
  on public.pharmacy_categories for select to authenticated using (auth.role() = 'authenticated');

drop policy if exists "public_read_pharmacy_categories" on public.pharmacy_categories;
create policy "public_read_pharmacy_categories"
  on public.pharmacy_categories for select to anon, authenticated using (true);

drop policy if exists "authenticated_write_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_write_pharmacy_categories"
  on public.pharmacy_categories for insert to authenticated with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_update_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_update_pharmacy_categories"
  on public.pharmacy_categories for update to authenticated using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_delete_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_delete_pharmacy_categories"
  on public.pharmacy_categories for delete to authenticated using (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
