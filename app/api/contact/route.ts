import { Resend } from "resend";
import { z } from "zod";
import { siteConfig } from "@/lib/site-config";

const recipient = process.env.RESEND_TO_EMAIL || siteConfig.email;

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.union([z.string().trim().email().max(254), z.literal("")]),
  phone: z.string().trim().max(35),
  serviceId: z.enum(["S01", "S02", "S03", "S04", "S05", "S06", "S07", "S08", "S09", "S10", "general"]),
  message: z.string().trim().min(10).max(1500),
  privacyAcknowledged: z.literal(true),
  website: z.string().max(200).optional(), // spam honeypot; never rendered to visitors
}).refine((data) => Boolean(data.email || data.phone), {
  message: "Please provide an email address or phone number.",
  path: ["email"],
});

const serviceNames: Record<string, string> = {
  S01: "Typing & Typesetting", S02: "Photocopying & Scanning",
  S03: "Passport Photos", S04: "Print From Your Phone",
  S05: "NIN Assistance", S06: "WAEC & NECO Services",
  S07: "Computer Training", S08: "Agreement & Documents",
  S09: "Website Design & Development", S10: "Mobile App Development",
  general: "General enquiry",
};

const rateWindowMs = 15 * 60 * 1000;
const requests = new Map<string, { count: number; until: number }>();

function configured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL && recipient);
}

export async function GET() {
  return Response.json({ enabled: configured() }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  if (!configured()) {
    return Response.json({ error: "Online enquiries are being configured. Please contact us directly." }, { status: 503 });
  }

  const declaredSize = Number(request.headers.get("content-length") || 0);
  if (declaredSize > 10_000) return Response.json({ error: "Message too long." }, { status: 413 });

  let body: unknown;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Please check the enquiry fields." }, { status: 400 });
  }

  // Silently drop automated honeypot submissions.
  if (parsed.data.website) return Response.json({ accepted: true });

  // Best-effort edge-isolate throttle, plus the honeypot. A shared rate limiter
  // or bot challenge should be configured before broad public traffic.
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const now = Date.now();
  const previous = requests.get(ip);
  if (previous && previous.until > now && previous.count >= 5) {
    return Response.json({ error: "Too many enquiries. Please try again later or call us." }, { status: 429 });
  }
  if (requests.size > 2000) requests.clear();
  requests.set(ip, previous && previous.until > now
    ? { count: previous.count + 1, until: previous.until }
    : { count: 1, until: now + rateWindowMs });

  const data = parsed.data;
  const reference = crypto.randomUUID();
  const text = [
    "New Supreme Computer website enquiry",
    `Reference: ${reference}`,
    `Service: ${serviceNames[data.serviceId]}`,
    `Name: ${data.name}`,
    `Email: ${data.email || "Not provided"}`,
    `Phone: ${data.phone || "Not provided"}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [recipient],
      subject: `Supreme Computer enquiry — ${serviceNames[data.serviceId]}`,
      text,
      ...(data.email ? { replyTo: data.email } : {}),
    });

    if (error) {
      return Response.json({ error: "We couldn't send the enquiry. Please call or use WhatsApp instead." }, { status: 502 });
    }
    return Response.json({ accepted: true, reference });
  } catch {
    return Response.json({ error: "Email service temporarily unavailable. Please call or use WhatsApp." }, { status: 502 });
  }
}
