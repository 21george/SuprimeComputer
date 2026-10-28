# Remove All Hardcoded Text — Fetch Everything from Supabase

## Context

The Supreme Computer website currently mixes Supabase-driven content with hardcoded fallbacks. The database schema (`sc_settings`, `sc_copy`, `sc_services`, `sc_service_items`, `sc_service_faqs`, `sc_training_topics`, `sc_training_examples`, `sc_benefits`, `sc_process_steps`, `sc_media`) and the query layer in `lib/supabase-content.ts` already handle a large portion of the content. However, many UI labels, page metadata, form text, navigation items, and entire page bodies remain hardcoded in components.

This plan completes the migration so that **all visible text and page metadata** is queried from Supabase at request time, with the existing hardcoded strings becoming true fallbacks used only when Supabase is not yet configured.

## 1. Database Schema Changes

### 1.1 Add SEO fields to `sc_services`

Add `seo_title` and `seo_description` to `sc_services` so each service detail page can have its own metadata.

```sql
alter table public.sc_services add column if not exists seo_title text;
alter table public.sc_services add column if not exists seo_description text;
```

## 2. New / Updated Query Functions

### 2.1 `lib/supabase-content.ts`

Add these lightweight helpers (reusing the existing `query()` helper):

- `getAllCopy(): Promise<Record<string, string>>` — returns every published `sc_copy` row as `{page_key.content_key: body}`.
- `getServiceBySlug(slug: string): Promise<DbService | null>` — fetches a single published service row by slug, including the new `seo_title` and `seo_description`.
- `getContactServiceList(): Promise<[string, string][]>` — returns the service dropdown list for the contact form (using `sc_services` instead of a client-side fallback).

Update `getSiteContent()` to also fetch `sc_copy` rows with `page_key = 'global'`, `'nav'`, `'footer'`, `'contact'`, etc. (it already fetches all copy, so no change needed there).

## 3. Seed Data (`supabase/002_seed.sql`)

Insert new `sc_copy` rows for every hardcoded text block found in the source. Group by `page_key`:

| `page_key` | Keys to add |
|---|---|
| `contact` | `form_eyebrow`, `form_heading`, `form_intro`, `mode_supabase`, `mode_mailto`, `label_name`, `label_service`, `label_email`, `label_phone`, `label_message`, `label_privacy`, `button_send`, `button_mailto`, `button_sending`, `whatsapp_fallback`, `validation_contact_required`, `status_mailto`, `status_success_emailed`, `status_success_pending`, `status_error` |
| `service_detail` | `breadcrumb`, `section_marker`, `intro_heading`, `help_heading`, `prepare_heading`, `steps_heading`, `good_to_know`, `faq_section_marker`, `faq_heading`, `aside_kicker`, `aside_heading`, `aside_body`, `aside_directions`, `related_marker`, `related_heading`, `related_view_all`, `closing_location`, `closing_prefix`, `closing_action`, `training_marker`, `training_heading`, `training_description`, `reel_marker`, `reel_heading`, `reel_description`, `reel_download`, `reel_caption`, `exam_feature_label`, `exam_feature_heading`, `exam_feature_body`, `exam_feature_disclaimer` |
| `privacy` | `title`, `eyebrow`, `intro`, `collected_heading`, `collected_body_1`, `collected_body_2`, `sensitive_heading`, `sensitive_body`, `questions_heading`, `questions_body`, `contact_phones`, `contact_email`, `closing` |
| `nav` | `home`, `services`, `about`, `contact`, `call_now` |
| `transition` | `wordmark`, `caption_1`, `caption_2` |
| `marquee` | `text` |
| `footer` | `explore_heading`, `contact_heading`, `back_to_home`, `privacy_link` |
| `contact_section` | `card_head`, `card_status`, `label_call`, `label_whatsapp`, `label_email`, `label_hours`, `label_visit`, `card_bottom` |
| `api` | `error_not_configured`, `error_rate_limit`, `error_service_unavailable`, `error_save_failed`, `email_subject`, `email_body_header` |

Also update each `sc_services` row to set `seo_title` and `seo_description`.

## 4. Component Updates

### 4.1 `app/layout.tsx`

- Replace the static `metadata` export with an async `generateMetadata()` function.
- Call `getSiteContent()` and use `settings.seo_title` / `settings.seo_description` for the default title and description.
- Pass the fetched `global.copy` down to `<PageTransitions />` as props.

### 4.2 `app/page.tsx`

The page already uses `getSiteContent()` and the `t()` / `globalText()` helpers. Extend it to:

- Replace hardcoded navigation labels with lookups from `nav.*` copy keys.
- Replace hardcoded marquee text with `marquee.text`.
- Replace hardcoded contact card labels (`CONTACT DETAILS`, `GIVE US A CALL`, etc.) with `contact_section.*` keys.
- Replace hardcoded footer nav headings and links with `footer.*` / `nav.*` keys.
- Pass the full copy record and the service list down to `<ContactForm />` instead of letting it maintain its own fallback.

### 4.3 `app/services/*/page.tsx` (5 files)

Each file currently exports a static `metadata` object. Replace with an async `generateMetadata({ params })` that:

- Calls a new `getServiceBySlug(params.slug)` helper.
- Returns `{ title: service.seo_title || service.title, description: service.seo_description || service.summary }`.

This removes the hardcoded title/description for every service route.

### 4.4 `app/privacy/page.tsx`

- Convert the page to an async server component.
- Fetch the full copy record and render every paragraph from `privacy.*` keys.
- Use `settings.email`, `settings.primary_phone`, and `settings.secondary_phone` instead of hardcoded contact details.

### 4.5 `components/contact-form.tsx`

- Remove the local `fallbackServices` array.
- Accept `services` and `copy` as props from the parent.
- Use `copy['contact.label_name']`, `copy['contact.button_send']`, etc. for every label, button, and status message.
- Use the `recipient` prop as-is (already wired from `settings.email`).

### 4.6 `components/service-detail-page.tsx`

- Accept a new `copy: Record<string, string>` prop.
- Replace every hardcoded UI string (section headings, aside copy, training labels, reel labels, breadcrumb, related-services headings, closing CTA) with lookups like `copy['service_detail.help_heading']`.
- Keep the existing `settings`, `hours`, and `media` props unchanged.

### 4.7 `components/page-transitions.tsx`

- Accept `copy` as a prop.
- Replace hardcoded "SUPREME COMPUTER", "PRINTING / DIGITAL SERVICES", "BENIN CITY, NIGERIA" with `copy['transition.wordmark']`, `copy['transition.caption_1']`, `copy['transition.caption_2']`.

### 4.8 `components/mobile-nav.tsx`

- Accept `navLinks` as a prop instead of the local `links` array.
- Accept `callLabel` as a prop instead of hardcoded "Call now".

### 4.9 `app/api/contact/route.ts`

- Import a new `getAllCopy()` helper.
- On `POST`, fetch copy and use it for every user-facing error message and email template string (`email_subject`, `email_body_header`, etc.).
- Keep the Zod validation messages as hardcoded (they are developer-facing, not visitor-facing).

## 5. Verification

1. **Local build**: `npm run typecheck` must pass.
2. **Supabase seed**: Run the updated `002_seed.sql` in the Supabase SQL Editor. Confirm the new `sc_copy` rows are present.
3. **Content check**: With `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` set in `.env.local`, start the dev server and verify:
   - Homepage renders with no visible fallback text.
   - Each service detail page has correct, unique metadata.
   - Privacy page renders fully from Supabase.
   - Contact form labels and status messages read from Supabase.
   - Page transition overlay text reads from Supabase.
   - Navigation labels read from Supabase.
   - Marquee text reads from Supabase.
4. **Fallback check**: Remove Supabase env vars and confirm the site still renders using the existing hardcoded fallbacks.
