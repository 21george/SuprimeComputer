# Supreme Computer — Next.js + TypeScript

Standalone, responsive Supreme Computer website built with **Next.js 16 (App Router)** and TypeScript. This is the standard Next.js edition; it does **not** require Vinext, Wrangler, or the ChatGPT Sites runtime.

## Main features

- Green/branded editorial UI, animated mobile navigation, cinematic 3D hero and GSAP/ScrollTrigger animations.
- Smooth green-wipe transitions between internal pages; service pages ease into view. Navigation honors reduced-motion preferences and preserves native in-page anchors.
- Reusable React components, five service detail pages, and 10 service cards.
- Route-level skeleton loading for the homepage and service-detail routes (`app/loading.tsx` and `app/services/loading.tsx`).
- Editable public content, business details, training topics, opening hours and image URLs from Supabase.
- Server-only contact enquiry storage in Supabase, with optional Resend email notifications.
- RLS-based read-only permissions for public content; enquiries and notification logs remain private.
- The public website continues with its initial content if Supabase environment variables haven't been configured.

## Run locally

Requires Node.js 22.13+ and npm.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Set up Supabase

Target project: `suprimecomputer` (`vdesszrjvlxokmfofurv`).

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/vdesszrjvlxokmfofurv/sql).
2. Run `supabase/001_schema.sql` in a new query. This creates the 13 prefixed tables, relationships, grants, and RLS policies.
3. Run `supabase/002_seed.sql` in another query to import the existing services, training courses, business contact details, opening hours and media references. **Run the seed once**; running it again can overwrite content edits made later in Supabase Table Editor.
4. Open Table Editor and confirm `sc_services` has 10 entries, `sc_hours` has seven, and `sc_contact_submissions` starts empty.
5. Populate `.env.local` with your keys (keep the secret key private).

```dotenv
SUPABASE_URL=https://vdesszrjvlxokmfofurv.supabase.co
SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-server-only-secret-key

RESEND_API_KEY=your-server-only-resend-key
RESEND_FROM_EMAIL=Supreme Computer <hello@your-verified-domain.com>
RESEND_TO_EMAIL=computersupreme0@gmail.com
```

**Never commit `.env.local`, publish the Supabase secret key, or include it in client-side environment variables.** The contact endpoint works only after both the Supabase publishable and secret keys have been configured. If Resend is not configured, submissions can still be stored in Supabase; the UI reports that the email notification is pending.

For security notes, data-table descriptions, and setup details, see [`supabase/README.md`](supabase/README.md).

## Commands

```bash
npm run dev       # Next.js development server
npm run typecheck # TypeScript check
npm run build     # Production build
npm run start     # Start after building
npm run video:iphone # Generate the 15-second iPhone promo (requires ffmpeg)
```

## iPhone showcase video

The ready-to-share, silent **15-second vertical (9:16) H.264 MP4** is at
`public/videos/supreme-computer-iphone-preview.mp4`, with a poster at
`public/videos/supreme-computer-iphone-preview-poster.png`.

This is a motion-designed iPhone *illustration* of the homepage, services,
passport-photo detail page, training page and contact section, based on the
website's copy and visual system. It is not a literal browser screen recording.
It includes animated scrolling and the same green navigation wipe now used
between actual Next.js routes.

To regenerate, install ffmpeg, run `npm ci`, then `npm run video:iphone`.

## Deploy on Vercel

1. Add the project to a Git repository (or import the project into Vercel).
2. Select **Next.js** as the framework and keep its default build/output settings.
3. Set the six environment variables in the hosting dashboard. Never add private keys to the repo.
4. Ensure both Supabase SQL files have been executed before enabling the publishable key.
5. Deploy, then verify service pages, Supabase content edits, the contact form, and Resend delivery.

The built-in in-memory contact rate limiter is only best-effort per server instance. Before broad public launch, add a shared rate limit or challenge, confirm an enquiry-retention policy and review the privacy notice.

## Project structure

| Location | Purpose |
| --- | --- |
| `app/page.tsx` | Homepage, services and 3D hero |
| `app/services/*/page.tsx` | Individual service routes |
| `components/service-detail-page.tsx` | Reusable detail-page presentation |
| `components/site-skeleton.tsx` | Loading skeleton for home and service pages |
| `components/page-transitions.tsx` | Shared page-change animation and route prefetching |
| `scripts/create-iphone-promo.mjs` | Rebuild the vertical iPhone promo video |
| `lib/supabase-content.ts` | Server-only database queries and private writes |
| `app/api/contact/route.ts` | Validated contact submission and Resend delivery |
| `supabase/001_schema.sql` | Database schema and RLS policies |
| `supabase/002_seed.sql` | One-time website-content import |
| `public/images`, `public/videos` | Illustrations and training reel |

## Notes

- Content routes use `dynamic = "force-dynamic"` and read published rows when Supabase is enabled. No fake demonstration entries are used in the database migration.
- The original website content remains in source only as a safe fallback before initial database setup.
- Service-provider qualifications must be confirmed with the relevant authorities; the website does not claim to issue NINs or change examination results.
- The supplied 3D component includes an upstream attribution notice. Preserve it when modifying or redistributing the source.
