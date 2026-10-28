# Supreme Computer → Supabase

Supabase project: `suprimecomputer` / `vdesszrjvlxokmfofurv`

This directory contains the proposed schema and a one-time import of the current Supreme Computer website content. **The scripts have not been executed against the Supabase project.** No live data was modified merely by creating these files.

## Installation in the Supabase SQL Editor

1. Open your [Supabase project](https://supabase.com/dashboard/project/vdesszrjvlxokmfofurv).
2. Open **SQL Editor** → **New query**.
3. Paste and execute `001_schema.sql`. Review that 13 `sc_*` tables were created.
4. Paste and execute `002_seed.sql` to import the business information, opening hours, ten services, five detailed service pages, training topics, home copy, service illustrations and video links.
5. In **Table Editor**, confirm there are 10 records in `sc_services`, 7 in `sc_hours`, and no rows yet in `sc_contact_submissions`.

Do this in that exact order. The SQL files are non-destructive to non-`sc_*` tables. `002_seed.sql` is a *snapshot*, not an ongoing sync: after the first import, edit website content directly in Supabase and do not rerun the seed unless you intentionally wish to restore the initial copy.

The schema enables RLS on every new table. Public content permits read-only access to published rows. Contact messages and Resend delivery logs have **no anonymous or authenticated grants/policies**; they are accessible only to trusted server-side code using a Supabase secret key, and to administrators in the Supabase Dashboard. Do not add public contact-table policies.

## Environment variables for the Supreme Computer website

Configure these as **server-side environment variables** in `.env.local` for local development and your hosting provider's environment settings for production. Do not paste secret keys into chats, HTML, `NEXT_PUBLIC_*`, or Git commits.

```text
SUPABASE_URL=https://vdesszrjvlxokmfofurv.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=your-verified-sender@example.com
RESEND_TO_EMAIL=computersupreme0@gmail.com
```

The Supabase publishable key is safe for public-content queries **only with the provided grants and RLS**. The secret key is restricted to server-side contact saving and email-log updates. If the project still uses legacy `anon` / `service_role` keys, the website integration can be adapted, but the service-role key must remain server-only.

## Proposed contact delivery sequence

1. Visitor sends name, a reply method, a service and a message through the contact form.
2. The server validates input, enforces request limits, and inserts a private `sc_contact_submissions` row with a UUID reference.
3. The server attempts to send a Resend notification to `computersupreme0@gmail.com`.
4. The server saves the Resend send status and provider message ID in `sc_email_notifications` (best effort).
5. The browser receives its reference. If email fails but database saving succeeds, the enquiry remains stored and the UI distinguishes saved from emailed.

Never store NIN numbers, examination PINs, ID scans or sensitive documents through this generic form. Before enabling database collection for a public audience, agree on a retention period for enquiries and update the privacy notice accordingly.

## Source of truth

- `sc_settings`, `sc_hours`: business identity, contact details and hours.
- `sc_copy`: home page headlines, explanatory copy and footer text.
- `sc_services`: the ten service cards and detail-page introductions.
- `sc_service_items`, `sc_service_faqs`: detail-page steps, preparation, FAQs and benefits.
- `sc_training_topics`, `sc_training_examples`: Word, Excel, PowerPoint and CorelDRAW descriptions.
- `sc_benefits`, `sc_process_steps`: home page sections.
- `sc_media`: URLs and descriptions for hero illustrations, the NIN cards and training Reel.
- `sc_contact_submissions`, `sc_email_notifications`: private form submissions and Resend delivery state.

Use Supabase's Table Editor for content changes initially. A password-protected custom admin dashboard can be planned as a separate feature; one is not needed for this migration.

**Migration status:** SQL schema and seed are prepared; the website includes conditional Supabase data readers and a database-first contact flow. Until the Supabase project is populated and the server environment variables are configured, the website displays its original content and its contact form opens the visitor's email application. The Supabase migration has **not yet been applied or live-tested**.
