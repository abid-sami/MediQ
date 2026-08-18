-- Emergency SOS is available from the public Home page, including for users
-- who cannot log in during an emergency. Allow only constrained inserts from
-- anon/authenticated clients; reads and status updates remain staff-protected.
grant usage on schema public to anon, authenticated;
grant insert on table public.sos_requests to anon, authenticated;

drop policy if exists "public_submit_sos_requests" on public.sos_requests;
create policy "public_submit_sos_requests"
on public.sos_requests
for insert
to anon, authenticated
with check (
  length(trim(patient_name)) between 1 and 200
  and length(trim(location)) between 1 and 500
  and length(coalesce(patient_phone, '')) <= 40
  and length(coalesce(emergency_type, '')) <= 120
  and length(coalesce(destination_hospital, '')) <= 200
  and length(coalesce(assigned_driver, '')) <= 200
  and length(coalesce(eta, '')) <= 80
);

notify pgrst, 'reload schema';
