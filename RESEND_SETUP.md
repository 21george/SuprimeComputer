# Supreme Computer website enquiries (Resend)

The contact form is ready to use Resend for server-side email delivery. Messages are addressed to **computersupreme0@gmail.com** by default. If email delivery is not configured, the same form opens the visitor's email application with a prepared message instead; it does **not** silently claim to have sent an email.

## Enable email delivery

1. Create a Resend account and verify a domain you control in Resend. Use a sender address on that domain (for example, `enquiries@your-domain.com`). A Gmail inbox can receive messages, but it cannot act as a verified custom-domain sender.
2. Add the following secrets/environment variables in your site's production environment, not in Git:

   | Variable | Value |
   | --- | --- |
   | `RESEND_API_KEY` | Resend API key with email sending permission |
   | `RESEND_FROM_EMAIL` | Verified-domain sender, e.g. `Supreme Computer <enquiries@your-domain.com>` |
   | `RESEND_TO_EMAIL` | `computersupreme0@gmail.com` (optional; this is the default) |

3. Redeploy after setting the variables. Open `/api/contact` and verify that its `enabled` field is `true`. Submit a test enquiry from the website and confirm that the notification arrives in the business inbox.
4. Before opening to substantial public traffic, add a shared IP rate limit and bot protection such as Turnstile. The current in-memory limit and honeypot are best-effort protections only.

Only normal enquiries should be submitted. Do not collect NIN numbers, examination login credentials, ID documents, or other sensitive information through this form.

Documentation: https://resend.com/docs/send-with-nextjs
