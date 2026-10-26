# Supreme Computer — Next.js + TypeScript

Complete, reusable source code for the Supreme Computer website, including the cinematic 3D homepage, ten service cards, five service detail pages, the contact form, and a Resend email API.

## Tech stack

- Next.js App Router + TypeScript + React
- Tailwind CSS v4 plus carefully art-directed CSS
- GSAP + ScrollTrigger and Lenis for smooth scrolling
- Three.js + React Three Fiber + Drei for the 3D printer in the hero
- Reusable `GlyphPortal` scroll-through typography interaction
- Resend + Zod for server-side contact enquiries
- Lucide icons

## Quick start

You will need Node.js 22.13 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. For a production build:

```bash
npm run typecheck
npm run build
npm run start
```

You can leave the Resend credentials blank while developing. In that case the enquiry form offers an email-app fallback. The website does not claim an enquiry was sent until the server confirms it.

## Folder structure

```text
app/
  page.tsx                      Home: cinematic hero and ten services
  layout.tsx                    Metadata and global shell
  globals.css                   Green visual system and responsive styles
  privacy/page.tsx              Privacy and enquiry information
  services/[slug]/page.tsx      One route for all five detail pages
  api/contact/route.ts          Resend contact API
components/
  brand.tsx                     Shared company logo/wordmark
  site-header.tsx               Desktop and mobile navigation
  site-footer.tsx               Shared home and detail footers
  service-card.tsx              Reusable service card
  service-detail-page.tsx       Reusable detail-page template
  eyebrow.tsx                   Reusable section label
  mobile-nav.tsx                Accessible mobile menu
  contact-form.tsx              Enquiry form and fallback
  scroll-system.tsx             GSAP reveals and smooth scrolling
  hero-scene-loader.tsx         Optional WebGL detection/lazy load
  hero-scene.tsx                Three.js printer scene
  ui/glyph-portal.tsx           Scroll-driven type portal
lib/
  site-config.ts                Central contact details and hours
  services.ts                   Homepage service catalogue
  service-details.ts            All detailed service-page content
public/favicon.svg
```

## Included detail pages

| Slug | Page |
| --- | --- |
| `/services/passport-photos` | Passport photos and picture printing |
| `/services/print-from-phone` | Printing from a phone |
| `/services/nin-assistance` | NIN registration assistance |
| `/services/waec-neco` | WAEC and NECO services |
| `/services/computer-training` | Computer training |

All five pages share `components/service-detail-page.tsx`, which displays the hero, introduction, available assistance, preparation checklist, three steps, important note, FAQs, contact information, and related services. Page-specific text and illustration style are stored in `lib/service-details.ts`.

### Add another detail page

1. Add a new entry with a unique `slug` to `serviceDetails` in `lib/service-details.ts`.
2. Choose one of the supported illustration variants in the `art` field, or add a new variant to the `icons` mapping and styles in the detail component.
3. Give the corresponding card in `lib/services.ts` a `detailsHref` of `/services/your-slug`.

The dynamic route takes care of the new page automatically. No copied route file is needed.

## Email setup with Resend

1. Sign up for Resend and verify a domain that you control.
2. Create an API key with email-sending access.
3. Set these values in `.env.local` locally and as server-side environment variables at your host:

```dotenv
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=Supreme Computer <enquiries@your-verified-domain.com>
RESEND_TO_EMAIL=computersupreme0@gmail.com
```

4. Restart the development server and send a test enquiry.

Never put `RESEND_API_KEY` in a browser-exposed `NEXT_PUBLIC_` variable, frontend code, or Git. Resend's test-domain restrictions may prevent delivery to arbitrary recipients until your domain is verified.

`GET /api/contact` reports whether email delivery is configured. `POST /api/contact` validates fields and sends a plain-text email; it has a honeypot and basic in-process request throttling. For substantial public traffic, add durable rate limiting (e.g. Redis/KV) and bot protection appropriate to your host.

No uploaded identity documents, NIN numbers or exam credentials are accepted by the contact form. The service pages tell visitors to confirm official registration and result-checking requirements.

## Performance and accessibility

- The interactive 3D printer loads only when WebGL is available and the visitor is on a suitably sized screen.
- A CSS artwork fallback remains visible when 3D is disabled.
- Reduced-motion users do not receive forced smooth scroll or the 3D animation.
- Navigation uses standard links, the mobile menu exposes its state, and FAQs use native `<details>` elements.
- Service detail pages have per-page metadata and render as static paths during the build.

## Deployment

This export is a standard Next.js project, with `next dev`, `next build --webpack`, and `next start`; it does not require the custom Sites runtime. Webpack is used for a predictable production build across environments. Deploy it to any platform that supports Next.js server routes, such as Vercel or a Node.js server. Set the Resend variables in the hosting environment.

## License note

The Glyph Portal interaction is credited in its source header to Christian Katzmann under the MIT license. Retain that notice when modifying or redistributing the component.
# SuprimeComputer
