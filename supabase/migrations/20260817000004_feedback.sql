-- Public Home feedback submitted by visitors and displayed to staff.
create table if not exists public.feedback (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(trim(name)) > 0),
  feedback   text not null check (char_length(trim(feedback)) > 0),
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

grant usage on schema public to anon, authenticated;
grant insert on public.feedback to anon, authenticated;
grant select on public.feedback to authenticated;

drop policy if exists "public_can_submit_feedback" on public.feedback;
create policy "public_can_submit_feedback"
  on public.feedback for insert to anon, authenticated
  with check (char_length(trim(name)) > 0 and char_length(trim(feedback)) > 0);

drop policy if exists "staff_can_read_feedback" on public.feedback;
create policy "staff_can_read_feedback"
  on public.feedback for select to authenticated
  using (true);

notify pgrst, 'reload schema';
