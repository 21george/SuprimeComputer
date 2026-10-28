-- Supreme Computer: public website content + private contact submissions
-- Target Supabase project: vdesszrjvlxokmfofurv (suprimecomputer)
-- Run in the Supabase SQL Editor before importing website content.
-- Safe to keep in source control: this file contains no credentials.

begin;

create table if not exists public.sc_settings (
  id text primary key default 'main' check (id = 'main'),
  business_name text not null,
  subtitle text,
  email text not null,
  primary_phone text not null,
  secondary_phone text,
  primary_whatsapp text not null,
  secondary_whatsapp text,
  address text not null,
  locality text,
  city text not null,
  region text not null,
  country text not null default 'Nigeria',
  timezone text not null default 'Africa/Lagos',
  maps_url text,
  seo_title text,
  seo_description text,
  updated_at timestamptz not null default now()
);

-- 0 = Sunday, 1 = Monday, ... 6 = Saturday.
create table if not exists public.sc_hours (
  weekday smallint primary key check (weekday between 0 and 6),
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  note text,
  check (is_closed or (opens_at is not null and closes_at is not null and opens_at < closes_at))
);

-- Flexible editable copy for Home, About, process, footer, privacy and CTA text.
-- Example: page_key='home', content_key='hero_heading', body='Every detail. Done right.'
create table if not exists public.sc_copy (
  page_key text not null,
  content_key text not null,
  body text not null,
  published boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (page_key, content_key)
);

create table if not exists public.sc_services (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^S[0-9]{2}$'),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  position smallint not null unique check (position > 0),
  title text not null,
  short_title text not null,
  card_description text not null,
  action_label text not null,
  icon_key text not null,
  accent_key text not null,
  featured boolean not null default false,
  has_detail_page boolean not null default false,
  title_lead text,
  title_accent text,
  category text,
  visual_label text,
  art_key text,
  summary text,
  overview text,
  important_note text,
  seo_title text,
  seo_description text,
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.sc_service_items (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.sc_services(id) on delete cascade,
  section text not null check (section in ('help', 'prepare', 'step')),
  position smallint not null check (position > 0),
  title text,
  body text not null,
  unique (service_id, section, position)
);

create table if not exists public.sc_service_faqs (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.sc_services(id) on delete cascade,
  position smallint not null check (position > 0),
  question text not null,
  answer text not null,
  unique (service_id, position)
);

create table if not exists public.sc_training_topics (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.sc_services(id) on delete cascade,
  position smallint not null check (position > 0),
  name text not null,
  duration_label text not null,
  lead text not null,
  description text not null,
  unique (service_id, position)
);

create table if not exists public.sc_training_examples (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.sc_training_topics(id) on delete cascade,
  position smallint not null check (position > 0),
  body text not null,
  unique (topic_id, position)
);

create table if not exists public.sc_benefits (
  id uuid primary key default gen_random_uuid(),
  position smallint not null unique check (position > 0),
  title text not null,
  body text not null,
  published boolean not null default true
);

create table if not exists public.sc_process_steps (
  id uuid primary key default gen_random_uuid(),
  position smallint not null unique check (position > 0),
  title text not null,
  body text not null,
  icon_key text,
  published boolean not null default true
);

-- Stores editable media references; file binaries can remain on the website CDN
-- or later move to a dedicated public Supabase Storage bucket.
create table if not exists public.sc_media (
  id uuid primary key default gen_random_uuid(),
  asset_key text not null unique,
  service_id uuid references public.sc_services(id) on delete set null,
  file_url text not null,
  media_type text not null check (media_type in ('image', 'video', 'svg')),
  alt_text text not null default '',
  width integer check (width > 0),
  height integer check (height > 0),
  published boolean not null default true,
  updated_at timestamptz not null default now()
);

-- PRIVATE: never grant anonymous or user-facing read access to these tables.
create table if not exists public.sc_contact_submissions (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.sc_services(id) on delete set null,
  name text not null check (char_length(btrim(name)) between 2 and 100),
  email text,
  phone text,
  message text not null check (char_length(btrim(message)) between 10 and 1500),
  privacy_acknowledged boolean not null check (privacy_acknowledged),
  status text not null default 'new' check (status in ('new', 'in_progress', 'answered', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (nullif(btrim(coalesce(email, '')), '') is not null
      or nullif(btrim(coalesce(phone, '')), '') is not null)
);

create table if not exists public.sc_email_notifications (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null unique references public.sc_contact_submissions(id) on delete cascade,
  provider text not null default 'resend',
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  provider_message_id text,
  error_summary text,
  attempted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists sc_contact_submissions_newest_idx
  on public.sc_contact_submissions(created_at desc);
create index if not exists sc_contact_submissions_status_idx
  on public.sc_contact_submissions(status, created_at desc);
create index if not exists sc_service_items_lookup_idx
  on public.sc_service_items(service_id, section, position);

create or replace function public.sc_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

revoke execute on function public.sc_touch_updated_at() from public, anon, authenticated;

drop trigger if exists sc_settings_touch on public.sc_settings;
create trigger sc_settings_touch before update on public.sc_settings
  for each row execute function public.sc_touch_updated_at();
drop trigger if exists sc_copy_touch on public.sc_copy;
create trigger sc_copy_touch before update on public.sc_copy
  for each row execute function public.sc_touch_updated_at();
drop trigger if exists sc_services_touch on public.sc_services;
create trigger sc_services_touch before update on public.sc_services
  for each row execute function public.sc_touch_updated_at();
drop trigger if exists sc_media_touch on public.sc_media;
create trigger sc_media_touch before update on public.sc_media
  for each row execute function public.sc_touch_updated_at();
drop trigger if exists sc_contact_touch on public.sc_contact_submissions;
create trigger sc_contact_touch before update on public.sc_contact_submissions
  for each row execute function public.sc_touch_updated_at();
drop trigger if exists sc_notifications_touch on public.sc_email_notifications;
create trigger sc_notifications_touch before update on public.sc_email_notifications
  for each row execute function public.sc_touch_updated_at();

-- Supabase exposes the public schema via PostgREST. Always restrict grants
-- AND enable row-level security. All website content is read-only to visitors.
alter table public.sc_settings enable row level security;
alter table public.sc_hours enable row level security;
alter table public.sc_copy enable row level security;
alter table public.sc_services enable row level security;
alter table public.sc_service_items enable row level security;
alter table public.sc_service_faqs enable row level security;
alter table public.sc_training_topics enable row level security;
alter table public.sc_training_examples enable row level security;
alter table public.sc_benefits enable row level security;
alter table public.sc_process_steps enable row level security;
alter table public.sc_media enable row level security;
alter table public.sc_contact_submissions enable row level security;
alter table public.sc_email_notifications enable row level security;

revoke all on public.sc_settings, public.sc_hours, public.sc_copy,
  public.sc_services, public.sc_service_items, public.sc_service_faqs,
  public.sc_training_topics, public.sc_training_examples, public.sc_benefits,
  public.sc_process_steps, public.sc_media, public.sc_contact_submissions,
  public.sc_email_notifications from public, anon, authenticated;

grant select on public.sc_settings, public.sc_hours, public.sc_copy,
  public.sc_services, public.sc_service_items, public.sc_service_faqs,
  public.sc_training_topics, public.sc_training_examples, public.sc_benefits,
  public.sc_process_steps, public.sc_media to anon, authenticated;

grant all on public.sc_settings, public.sc_hours, public.sc_copy,
  public.sc_services, public.sc_service_items, public.sc_service_faqs,
  public.sc_training_topics, public.sc_training_examples, public.sc_benefits,
  public.sc_process_steps, public.sc_media, public.sc_contact_submissions,
  public.sc_email_notifications to service_role;

drop policy if exists sc_settings_public_read on public.sc_settings;
create policy sc_settings_public_read on public.sc_settings for select to anon, authenticated using (true);
drop policy if exists sc_hours_public_read on public.sc_hours;
create policy sc_hours_public_read on public.sc_hours for select to anon, authenticated using (true);
drop policy if exists sc_copy_public_read on public.sc_copy;
create policy sc_copy_public_read on public.sc_copy for select to anon, authenticated using (published);
drop policy if exists sc_services_public_read on public.sc_services;
create policy sc_services_public_read on public.sc_services for select to anon, authenticated using (published);
drop policy if exists sc_service_items_public_read on public.sc_service_items;
create policy sc_service_items_public_read on public.sc_service_items for select to anon, authenticated
  using (exists (select 1 from public.sc_services s where s.id = service_id and s.published));
drop policy if exists sc_service_faqs_public_read on public.sc_service_faqs;
create policy sc_service_faqs_public_read on public.sc_service_faqs for select to anon, authenticated
  using (exists (select 1 from public.sc_services s where s.id = service_id and s.published));
drop policy if exists sc_training_topics_public_read on public.sc_training_topics;
create policy sc_training_topics_public_read on public.sc_training_topics for select to anon, authenticated
  using (exists (select 1 from public.sc_services s where s.id = service_id and s.published));
drop policy if exists sc_training_examples_public_read on public.sc_training_examples;
create policy sc_training_examples_public_read on public.sc_training_examples for select to anon, authenticated
  using (exists (
    select 1 from public.sc_training_topics t
    join public.sc_services s on s.id = t.service_id
    where t.id = topic_id and s.published
  ));
drop policy if exists sc_benefits_public_read on public.sc_benefits;
create policy sc_benefits_public_read on public.sc_benefits for select to anon, authenticated using (published);
drop policy if exists sc_process_steps_public_read on public.sc_process_steps;
create policy sc_process_steps_public_read on public.sc_process_steps for select to anon, authenticated using (published);
drop policy if exists sc_media_public_read on public.sc_media;
create policy sc_media_public_read on public.sc_media for select to anon, authenticated using (published);

-- Intentionally NO anon/authenticated policies for contacts or notifications.
-- Only the trusted server can insert/read them via SUPABASE_SECRET_KEY.

commit;
