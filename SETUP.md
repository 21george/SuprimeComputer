# Supreme Computer website enquiries (Gmail SMTP + WhatsApp)

The contact form saves enquiries to Supabase and notifies the owner via **Gmail SMTP** and optionally **WhatsApp** (using CallMeBot). A confirmation email is also sent to the visitor when they provide an email address.

## Enable email delivery

1. Go to your Google Account and enable **2-Step Verification**.
2. Generate an **App Password** for "Mail" on your device (a 16-character password, e.g. `abcd efgh ijkl mnop`).
3. Add the following environment variables in your site's production environment:

   | Variable | Value |
   | --- | --- |
   | `SMTP_USER` | `computersupreme0@gmail.com` |
   | `SMTP_PASS` | Your 16-character Gmail App Password |
   | `SMTP_FROM_EMAIL` | `Supreme Computer <computersupreme0@gmail.com>` |
   | `SMTP_TO_EMAIL` | `computersupreme0@gmail.com` (optional; defaults to `SMTP_USER`) |

4. Redeploy after setting the variables. Submit a test enquiry from the website and confirm that the notification arrives in the business inbox and the confirmation reaches the sender.

## Enable WhatsApp owner notifications

1. Open WhatsApp on your phone and start a chat with **CallMeBot** (search for the contact or use [wa.me/34602944799](https://wa.me/34602944799)).
2. Send `/start` and follow the instructions to get your **API key**.
3. Add these environment variables:

   | Variable | Value |
   | --- | --- |
   | `WHATSAPP_ENABLED` | `true` |
   | `WHATSAPP_PHONE` | Your number in international format without `+` or spaces, e.g. `2348152404200` |
   | `WHATSAPP_API_KEY` | Your CallMeBot API key |

4. If the Supabase schema was already applied before WhatsApp support, run `supabase/003_whatsapp_migration.sql` in the SQL Editor to remove the unique constraint on `sc_email_notifications.contact_id`.

## Security

Before opening to substantial public traffic, add a shared IP rate limit and bot protection such as Turnstile. The current in-memory limit and honeypot are best-effort protections only.

Only normal enquiries should be submitted. Do not collect NIN numbers, examination login credentials, ID documents, or other sensitive information through this form.
