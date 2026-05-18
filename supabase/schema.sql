-- Studio.dev demo generation pipeline
-- Run this in Supabase SQL Editor (or via supabase CLI)

create table if not exists demo_jobs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  ticket_id text not null,

  -- Client inputs
  email text not null,
  name text,
  service_type text,
  description text not null,
  reference_urls text,

  -- Pipeline state
  status text not null default 'pending'
    check (status in ('pending', 'building', 'ready', 'failed')),
  html_path text,
  error text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists demo_jobs_status_idx on demo_jobs(status);
create index if not exists demo_jobs_slug_idx on demo_jobs(slug);
create index if not exists demo_jobs_created_idx on demo_jobs(created_at desc);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists demo_jobs_updated_at on demo_jobs;
create trigger demo_jobs_updated_at
  before update on demo_jobs
  for each row execute function set_updated_at();

-- Storage bucket for generated demo HTML (public read)
insert into storage.buckets (id, name, public)
values ('demos', 'demos', true)
on conflict (id) do nothing;

-- Public read policy for demos bucket
do $$ begin
  create policy "Public read demos"
    on storage.objects for select
    using (bucket_id = 'demos');
exception when duplicate_object then null; end $$;

-- RLS: lock demo_jobs from anon — only service role inserts/reads
alter table demo_jobs enable row level security;
-- (No policies = service-role only access via SUPABASE_SERVICE_ROLE_KEY)

-- ─── Email OTP verification (Apply form) ─────────────────────────
-- Stores hashed 6-digit codes sent during the apply flow. The /api/apply
-- route refuses to process a submission unless the submitter's email has
-- a matching `verified_at` row that's still within the JWT validity window.
create table if not exists email_verifications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  verified_at timestamptz,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists email_verifications_email_idx
  on email_verifications(email, created_at desc);
create index if not exists email_verifications_expires_idx
  on email_verifications(expires_at);

alter table email_verifications enable row level security;
-- (No policies = service-role only access via SUPABASE_SERVICE_ROLE_KEY)

create or replace function cleanup_old_verifications() returns void
language plpgsql security definer as $$
begin
  delete from email_verifications
   where created_at < now() - interval '24 hours';
end;
$$;

-- ─── Phone OTP verification (Apply form) ─────────────────────────
-- Mirror of email_verifications but keyed on a normalized 010 phone
-- number ("01012345678"). The /api/apply route refuses to process a
-- submission unless the submitter's phone has a matching verified row
-- still within the JWT validity window.
create table if not exists phone_verifications (
  id uuid primary key default gen_random_uuid(),
  phone text not null,
  code_hash text not null,
  attempts int not null default 0,
  expires_at timestamptz not null,
  verified_at timestamptz,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists phone_verifications_phone_idx
  on phone_verifications(phone, created_at desc);
create index if not exists phone_verifications_expires_idx
  on phone_verifications(expires_at);

alter table phone_verifications enable row level security;
-- (No policies = service-role only access via SUPABASE_SERVICE_ROLE_KEY)

create or replace function cleanup_old_phone_verifications() returns void
language plpgsql security definer as $$
begin
  delete from phone_verifications
   where created_at < now() - interval '24 hours';
end;
$$;

-- ─── Cleanup function ────────────────────────────────────────────
-- Deletes demo_jobs rows older than 7 days and their Storage objects.
-- Schedule via Supabase Dashboard → Database → Cron Jobs:
--   schedule:  0 18 * * *      (UTC 18:00 = KST 03:00)
--   command:   select cleanup_old_demos();
create or replace function cleanup_old_demos() returns void
language plpgsql security definer as $$
declare
  r record;
begin
  for r in
    select id, html_path
    from demo_jobs
    where created_at < now() - interval '7 days'
  loop
    if r.html_path is not null then
      delete from storage.objects
      where bucket_id = 'demos' and name = r.html_path;
    end if;
    delete from demo_jobs where id = r.id;
  end loop;
end;
$$;
