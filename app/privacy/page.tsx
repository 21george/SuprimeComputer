import type { Metadata } from "next";
import { ArrowLeft, Phone } from "lucide-react";
import { getAllCopy, getSiteContent } from "@/lib/supabase-content";

export const metadata: Metadata = {
  title: "Privacy & Enquiries | Supreme Computer",
  description: "Information about contacting Supreme Computer and privacy on this website.",
};

export default async function Privacy() {
  const [copy, site] = await Promise.all([getAllCopy(), getSiteContent()]);
  const settings = site?.settings;
  const t = (key: string, fallback: string) => copy[`privacy.${key}`] || fallback;

  const address = settings?.address || "Km 2, Upper Siluko Road, Akpata, Benin City, Edo State, Nigeria.";
  const email = settings?.email || "computersupreme0@gmail.com";
  const primaryPhone = settings?.primary_phone || "08152404200";
  const secondaryPhone = settings?.secondary_phone || "08084160376";

  const intro = t("intro", "Supreme Computer is located at {address}. This website presents our services and provides direct telephone and map links so you can contact us.").replace("{address}", address);
  const collectedBody1 = t("collected_body_1", "The enquiry form requests your name, email address or telephone number, selected service and message. When online submissions are enabled, these details are stored in a private Supabase database for Supreme Computer to review and respond to your enquiry. The website also attempts to email a notification to {email} through Resend, and records whether the notification was sent. An enquiry may still be saved even when an email notification fails.").replace("{email}", email);
  const contactPhones = t("contact_phones", "{primary_phone} or {secondary_phone}").replace("{primary_phone}", primaryPhone).replace("{secondary_phone}", secondaryPhone);
  const contactEmail = t("contact_email", "Email: {email}").replace("{email}", email);

  return (
    <main className="privacy-page" id="main-content">
      <div className="container">
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, marginBottom: 50 }}>
          <ArrowLeft size={17} /> {t("back_to_home", "Back to home")}
        </a>
        <p className="eyebrow">
          <span>{t("eyebrow", "SUPREME COMPUTER / INFORMATION")}</span>
          <i /> INFORMATION
        </p>
        <h1>{t("title", "Privacy & enquiries")}</h1>
        <p>{intro}</p>
        <h2>{t("collected_heading", "Information collected through this website")}</h2>
        <p>{collectedBody1}</p>
        <p>{t("collected_body_2", "Until online delivery is configured, the form opens your email application with a prepared message, which you must send yourself. Clicking telephone, WhatsApp or map links opens the corresponding external provider, subject to its own privacy policy.")}</p>
        <h2>{t("sensitive_heading", "Sensitive documents")}</h2>
        <p>{t("sensitive_body", "Do not send NIN numbers, passport scans, examination credentials or other sensitive document contents through public contact links without first confirming an appropriate process with our team.")}</p>
        <h2>{t("questions_heading", "Questions about your information")}</h2>
        <p>{t("questions_body", "To ask about an enquiry or request correction or deletion of your contact details, contact Supreme Computer using the information below. An enquiry reference is provided after online submission. The business should confirm an appropriate retention schedule and privacy practices before enabling public collection at scale.")}</p>
        <p>
          <a href={`tel:+234${primaryPhone.replace(/^0/, "").replace(/\D/g, "")}`}>
            <Phone size={15} style={{ display: "inline", verticalAlign: "middle" }} /> {contactPhones}
          </a>. {contactEmail}.
        </p>
        <p style={{ fontSize: 12, marginTop: 60 }}>{t("closing", "This notice describes the website enquiry flow and should be reviewed with the business owner before wider publication.")}</p>
      </div>
    </main>
  );
}
