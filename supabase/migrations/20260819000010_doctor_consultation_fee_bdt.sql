-- Persist each doctor's booking consultation fee in Bangladeshi taka.
alter table public.profiles
  add column if not exists consultation_fee_bdt numeric(10,2) not null default 0;

alter table public.profiles
  drop constraint if exists profiles_consultation_fee_bdt_nonnegative;

alter table public.profiles
  add constraint profiles_consultation_fee_bdt_nonnegative
  check (consultation_fee_bdt >= 0);
