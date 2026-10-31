-- Migration: allow multiple notification logs per contact submission
-- Run this in the Supabase SQL Editor if the schema was already applied before WhatsApp support.

-- Remove the unique constraint on contact_id so both email and WhatsApp notifications can be logged.
alter table public.sc_email_notifications
  drop constraint if exists sc_email_notifications_contact_id_key;

-- Add an index on contact_id for fast lookups now that duplicates are allowed.
create index if not exists sc_email_notifications_contact_idx
  on public.sc_email_notifications(contact_id);
