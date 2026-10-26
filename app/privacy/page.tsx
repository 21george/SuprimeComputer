import type { Metadata } from "next";
import { ArrowLeft, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy & Enquiries | Supreme Computer",
  description: "Information about contacting Supreme Computer and privacy on this website.",
};

export default function Privacy() {
  return <main className="privacy-page" id="main-content"><div className="container">
    <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 800, marginBottom: 50 }}><ArrowLeft size={17}/> Back to home</a>
    <p className="eyebrow"><span>SUPREME COMPUTER</span><i/> INFORMATION</p>
    <h1>Privacy &amp; enquiries</h1>
    <p>Supreme Computer is located at Km 2, Upper Siluko Road, Akpata, Benin City, Edo State, Nigeria. This website presents our services and provides direct telephone and map links so you can contact us.</p>
    <h2>Information collected through this website</h2>
    <p>The enquiry form requests a name, email or telephone number, selected service and message. When online submission is enabled, these details are sent to Supreme Computer at <a href="mailto:computersupreme0@gmail.com">computersupreme0@gmail.com</a> using the Resend email-delivery service. The website does not maintain a separate customer enquiry database. Emails and delivery records remain subject to the receiving mailbox and email provider&apos;s handling practices.</p>
    <p>Until online delivery is configured, the form opens your email application with a prepared message, which you must send yourself. Clicking telephone, WhatsApp or map links opens the corresponding external provider, subject to its own privacy policy.</p>
    <h2>Sensitive documents</h2>
    <p>Do not send NIN numbers, passport scans, examination credentials or other sensitive document contents through public contact links without first confirming an appropriate process with our team.</p>
    <h2>Questions about your information</h2>
    <p>Use the contact details below for questions about your enquiry or personal information. The business should finalize appropriate retention and data-handling procedures before enabling server-side form delivery or making the site broadly public.</p>
    <p><a href="tel:+2348152404200"><Phone size={15} style={{ display: "inline", verticalAlign: "middle" }}/> 08152404200</a> or <a href="tel:+2348084160376">08084160376</a>. Email: <a href="mailto:computersupreme0@gmail.com">computersupreme0@gmail.com</a>.</p>
    <p style={{ fontSize: 12, marginTop: 60 }}>This notice describes the website in its initial public-information configuration and should be reviewed with the business owner before wider publication.</p>
  </div></main>;
}
