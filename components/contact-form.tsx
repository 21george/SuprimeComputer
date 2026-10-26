"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const services = [
  ["general", "General enquiry"], ["S01", "Typing & Typesetting"],
  ["S02", "Photocopying & Scanning"], ["S03", "Passport Photos"],
  ["S04", "Print From Your Phone"], ["S05", "NIN Assistance"],
  ["S06", "WAEC & NECO Services"], ["S07", "Computer Training"],
  ["S08", "Agreement & Documents"],
  ["S09", "Website Design & Development"], ["S10", "Mobile App Development"],
] as const;

export default function ContactForm() {
  const [mode, setMode] = useState<"checking" | "resend" | "mailto">("checking");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contact", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { enabled: false })
      .then((data: unknown) => { if (!cancelled) setMode((data as { enabled?: boolean })?.enabled ? "resend" : "mailto"); })
      .catch(() => { if (!cancelled) setMode("mailto"); });
    return () => { cancelled = true; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    const form = event.currentTarget;
    const raw = new FormData(form);
    const values = {
      name: String(raw.get("name") || "").trim(),
      email: String(raw.get("email") || "").trim(),
      phone: String(raw.get("phone") || "").trim(),
      serviceId: String(raw.get("serviceId") || "general"),
      message: String(raw.get("message") || "").trim(),
      privacyAcknowledged: raw.has("privacyAcknowledged"),
      website: String(raw.get("website") || ""),
    };
    if (!values.email && !values.phone) {
      setStatus("Please add an email address or phone number so our team can reply.");
      return;
    }
    setStatus("");

    if (mode !== "resend") {
      const service = services.find(([id]) => id === values.serviceId)?.[1] || "General enquiry";
      const body = [
        `Name: ${values.name}`, `Email: ${values.email || "Not provided"}`,
        `Phone: ${values.phone || "Not provided"}`, `Service: ${service}`,
        "", values.message,
      ].join("\n");
      window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(`Supreme Computer enquiry — ${service}`)}&body=${encodeURIComponent(body)}`;
      setStatus("Your email application should open with the enquiry. Press Send there to complete it. You can also contact us by phone or WhatsApp.");
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to send your enquiry. Please contact us directly.");
      setSuccess(true);
      setStatus("Thank you. Your enquiry was accepted for delivery. Our team will review it.");
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Something went wrong. Please try calling us.");
    } finally { setSending(false); }
  }

  return <div className="enquiry-panel" data-reveal>
    <div className="enquiry-intro"><span className="eyebrow"><span>ENQUIRIES</span><i/> CONTACT FORM</span><h3>Tell us what<br/><em>you need.</em></h3><p>Have a question about one of our services? Leave the details below. Please do not include NIN numbers, exam credentials or sensitive documents.</p>
      <div className="enquiry-mode"><Mail size={16}/>{mode === "resend" ? "Secure website enquiry" : "Enquiry opens in your email app until online delivery is configured"}</div>
    </div>
    <form className="enquiry-form" onSubmit={submit}>
      <div className="enquiry-two-col"><label>Full name <span>*</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Your name"/></label><label>Service <span>*</span><select name="serviceId" required>{services.map(([id,label]) => <option value={id} key={id}>{label}</option>)}</select></label></div>
      <div className="enquiry-two-col"><label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com"/></label><label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength={35} placeholder="Your phone number"/></label></div>
      <label>Your message <span>*</span><textarea name="message" rows={5} minLength={10} maxLength={1500} required placeholder="How can we help?"/></label>
      <label className="enquiry-check"><input type="checkbox" name="privacyAcknowledged" required/><span>I have read the <a href="/privacy">privacy and enquiry information</a>. <strong>*</strong></span></label>
      <label className="enquiry-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <div className="enquiry-submit"><button className="btn btn-primary btn-large" type="submit" disabled={sending || mode === "checking"}>{sending ? "Sending…" : mode === "resend" ? "Send enquiry" : "Continue in email app"}{mode === "resend" ? <Send size={16}/> : <ArrowUpRight size={17}/>}</button><span>Prefer to chat? <a href="https://wa.me/2348152404200" target="_blank" rel="noopener noreferrer">WhatsApp us</a></span></div>
      {status && <p className={`enquiry-status ${success ? "enquiry-success" : ""}`} role="status" aria-live="polite">{status}</p>}
    </form>
  </div>;
}
