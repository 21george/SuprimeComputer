# Supreme Computer website enquiries (Gmail SMTP)

The contact form sends emails directly using Gmail SMTP. Messages are addressed to **computersupreme0@gmail.com** by default, and a confirmation email is also sent to the visitor when they provide an email address.

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
5. Before opening to substantial public traffic, add a shared IP rate limit and bot protection such as Turnstile. The current in-memory limit and honeypot are best-effort protections only.

Only normal enquiries should be submitted. Do not collect NIN numbers, examination login credentials, ID documents, or other sensitive information through this form.
