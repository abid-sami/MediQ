-- Forward-only permission repair for databases where the category migration
-- has already been applied without table-level grants.

grant usage on schema public to anon, authenticated;
grant select on public.pharmacy_categories to anon;
grant select, insert, update, delete on public.pharmacy_categories to authenticated;

alter table public.pharmacy_categories enable row level security;

drop policy if exists "authenticated_read_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_read_pharmacy_categories"
  on public.pharmacy_categories for select to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "public_read_pharmacy_categories" on public.pharmacy_categories;
create policy "public_read_pharmacy_categories"
  on public.pharmacy_categories for select to anon, authenticated
  using (true);

drop policy if exists "authenticated_write_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_write_pharmacy_categories"
  on public.pharmacy_categories for insert to authenticated
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_update_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_update_pharmacy_categories"
  on public.pharmacy_categories for update to authenticated
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_delete_pharmacy_categories" on public.pharmacy_categories;
create policy "authenticated_delete_pharmacy_categories"
  on public.pharmacy_categories for delete to authenticated
  using (auth.role() = 'authenticated');

notify pgrst, 'reload schema';
