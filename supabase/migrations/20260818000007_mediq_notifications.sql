-- Dynamic MediQ notifications: one row per recipient for reliable unread/read state.
create table if not exists public.mediq_notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  title text not null,
  message text not null,
  notification_type text not null default 'general',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists mediq_notifications_recipient_created_idx
  on public.mediq_notifications (recipient_id, created_at desc);

-- Supabase checks table privileges before evaluating RLS policies.
grant usage on schema public to authenticated;
grant select, insert, update on table public.mediq_notifications to authenticated;

alter table public.mediq_notifications enable row level security;

drop policy if exists "Users can read their MediQ notifications" on public.mediq_notifications;
create policy "Users can read their MediQ notifications"
  on public.mediq_notifications for select to authenticated
  using (recipient_id = auth.uid());

-- SECURITY DEFINER avoids profile RLS recursion while checking the sender role.
create or replace function public.can_send_mediq_notifications()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role::text in ('Super Admin', 'Receptionist')
  );
$$;
revoke all on function public.can_send_mediq_notifications() from public;
grant execute on function public.can_send_mediq_notifications() to authenticated;

drop policy if exists "Authorized staff can send MediQ notifications" on public.mediq_notifications;
create policy "Authorized staff can send MediQ notifications"
  on public.mediq_notifications for insert to authenticated
  with check (
    sender_id = auth.uid()
    and public.can_send_mediq_notifications()
  );

drop policy if exists "Users can update their MediQ notifications" on public.mediq_notifications;
create policy "Users can update their MediQ notifications"
  on public.mediq_notifications for update to authenticated
  using (recipient_id = auth.uid())
  with check (recipient_id = auth.uid());

-- Use this RPC for sending. It runs with the function owner's privileges,
-- validates the caller from auth.uid(), and performs the multi-recipient insert.
create or replace function public.send_mediq_notifications(
  p_recipient_ids uuid[],
  p_title text,
  p_message text,
  p_type text default 'general'
)
returns setof public.mediq_notifications
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
begin
  select p.role::text into caller_role
  from public.profiles p
  where p.id = auth.uid();

  if caller_role not in ('Super Admin', 'Receptionist') then
    raise exception 'Only Admin or Receptionist users can send notifications';
  end if;

  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_message), '') = '' then
    raise exception 'Notification title and message are required';
  end if;

  return query
  insert into public.mediq_notifications (
    recipient_id, sender_id, title, message, notification_type
  )
  select distinct recipient_id, auth.uid(), trim(p_title), trim(p_message), coalesce(nullif(trim(p_type), ''), 'general')
  from unnest(p_recipient_ids) as recipients(recipient_id)
  where recipient_id is not null
  returning *;
end;
$$;
revoke all on function public.send_mediq_notifications(uuid[], text, text, text) from public;
grant execute on function public.send_mediq_notifications(uuid[], text, text, text) to authenticated;

alter table public.mediq_notifications replica identity full;

-- Safe to run repeatedly in Supabase projects where realtime is already enabled.
do $$
begin
  alter publication supabase_realtime add table public.mediq_notifications;
exception when duplicate_object then null;
end $$;
