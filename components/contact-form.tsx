"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Mail, Send } from "lucide-react";

export default function ContactForm({ services, recipient = "computersupreme0@gmail.com", copy = {} }: { services?: [string, string][]; recipient?: string; copy?: Record<string, string> }) {
  const t = (key: string, fallback: string) => copy[`contact.${key}`] || fallback;
  const [mode, setMode] = useState<"checking" | "supabase" | "mailto">("checking");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contact", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : { enabled: false })
      .then((data: unknown) => { if (!cancelled) setMode((data as { enabled?: boolean })?.enabled ? "supabase" : "mailto"); })
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
      setStatus(t("validation_contact_required", "Please add an email address or phone number so our team can reply."));
      return;
    }
    setStatus("");

    if (mode !== "supabase") {
      const service = services?.find(([id]) => id === values.serviceId)?.[1] || "General enquiry";
      const body = [
        `Name: ${values.name}`, `Email: ${values.email || "Not provided"}`,
        `Phone: ${values.phone || "Not provided"}`, `Service: ${service}`,
        "", values.message,
      ].join("\n");
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(`${t("email_subject", "Supreme Computer enquiry")} — ${service}`)}&body=${encodeURIComponent(body)}`;
      setStatus(t("status_mailto", "Your email application should open with the enquiry. Press Send there to complete it. You can also contact us by phone or WhatsApp."));
      return;
    }

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json().catch(() => ({})) as { error?: string; emailed?: boolean; reference?: string };
      if (!response.ok) throw new Error(result.error || t("status_error", "Unable to send your enquiry. Please contact us directly."));
      setSuccess(true);
      setStatus(result.emailed
        ? t("status_success_emailed", "Thank you. Your enquiry has been saved and the notification email sent. Reference: {reference}.").replace("{reference}", result.reference || "")
        : t("status_success_pending", "Thank you. Your enquiry has been saved. Email notification is pending; you can also call us. Reference: {reference}.").replace("{reference}", result.reference || ""));
      form.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t("status_error", "Something went wrong. Please try calling us."));
    } finally { setSending(false); }
  }

  return <div className="enquiry-panel" data-reveal>
    <div className="enquiry-intro"><span className="eyebrow"><span>{t("form_eyebrow", "ENQUIRIES / CONTACT FORM")}</span><i/> CONTACT FORM</span><h3>{t("form_heading", "Tell us what")}<br/><em>you need.</em></h3><p>{t("form_intro", "Have a question about one of our services? Leave the details below. Please do not include NIN numbers, exam credentials or sensitive documents.")}</p>
      <div className="enquiry-mode"><Mail size={16}/>{mode === "supabase" ? t("mode_supabase", "Website enquiry saved privately") : t("mode_mailto", "Enquiry opens in your email app until online delivery is configured")}</div>
    </div>
    <form className="enquiry-form" onSubmit={submit}>
      <div className="enquiry-two-col"><label>{t("label_name", "Full name")} <span>*</span><input name="name" autoComplete="name" minLength={2} maxLength={100} required placeholder="Your name"/></label><label>{t("label_service", "Service")} <span>*</span><select name="serviceId" required>{services?.map(([id,label]) => <option value={id} key={id}>{label}</option>)}</select></label></div>
      <div className="enquiry-two-col"><label>{t("label_email", "Email address")}<input name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com"/></label><label>{t("label_phone", "Phone number")}<input name="phone" type="tel" autoComplete="tel" maxLength={35} placeholder="Your phone number"/></label></div>
      <label>{t("label_message", "Your message")} <span>*</span><textarea name="message" rows={5} minLength={10} maxLength={1500} required placeholder="How can we help?"/></label>
      <label className="enquiry-check"><input type="checkbox" name="privacyAcknowledged" required/><span>{t("label_privacy", "I have read the privacy and enquiry information.")} <strong>*</strong></span></label>
      <label className="enquiry-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
      <div className="enquiry-submit"><button className="btn btn-primary btn-large" type="submit" disabled={sending || mode === "checking"}>{sending ? t("button_sending", "Sending…") : mode === "supabase" ? t("button_send", "Send enquiry") : t("button_mailto", "Continue in email app")}{mode === "supabase" ? <Send size={16}/> : <ArrowUpRight size={17}/>}</button><span>{t("whatsapp_fallback", "Prefer to chat?")} <a href="https://wa.me/2348152404200" target="_blank" rel="noopener noreferrer">WhatsApp us</a></span></div>
      {status && <p className={`enquiry-status ${success ? "enquiry-success" : ""}`} role="status" aria-live="polite">{status}</p>}
    </form>
  </div>;
}
