import { ArrowUpRight, BookOpen, Camera, Clock3, Copy, FilePenLine, FileText, Globe2, GraduationCap, IdCard, Mail, MapPin, MessageCircle, Phone, ScanLine, Smartphone, TabletSmartphone, type LucideIcon } from "lucide-react";
import HeroScene from "@/components/hero-scene-loader";
import MobileNav from "@/components/mobile-nav";
import ScrollSystem from "@/components/scroll-system";
import ContactForm from "@/components/contact-form";
import GlyphPortal from "@/components/ui/glyph-portal";
import { getSiteContent, type ServiceCardContent } from "@/lib/supabase-content";

// Read current published content from Supabase at request time after activation.
export const dynamic = "force-dynamic";

const PRIMARY_PHONE = "tel:+2348152404200";
const SECONDARY_PHONE = "tel:+2348084160376";
const EMAIL = "computersupreme0@gmail.com";
const WHATSAPP_PRIMARY = "https://wa.me/2348152404200";
const WHATSAPP_SECONDARY = "https://wa.me/2348084160376";
const ADDRESS = "Km 2, Upper Siluko Road, Akpata, Benin City, Edo State, Nigeria.";
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

type Service = Omit<ServiceCardContent, "iconKey" | "featured"> & { icon: LucideIcon; featured?: boolean; iconKey?: string };
const fallbackServices: Service[] = [
  { id: "01", label: "Typing & Typesetting", description: "Neat, professional typing and formatting for letters, applications, agreements and important documents.", icon: FilePenLine, action: "Ask about typing", accent: "type" },
  { id: "02", label: "Photocopying & Scanning", description: "Clear photocopies, digital document scans and dependable reprinting for your everyday needs.", icon: ScanLine, action: "Ask about scanning", accent: "scan" },
  { id: "03", label: "Passport Photos", description: "Passport photographs and quality picture printing for personal, school and professional needs.", icon: Camera, action: "Ask about photos", accent: "photo", detailsHref: "/services/passport-photos" },
  { id: "04", label: "Print From Your Phone", description: "Have a file on your phone? Contact our team to arrange convenient, professional printing.", icon: Smartphone, action: "Ask how it works", accent: "phone", detailsHref: "/services/print-from-phone" },
  { id: "05", label: "NIN Assistance", description: "Guidance with NIN registration-related processes, subject to applicable official requirements.", icon: IdCard, action: "Ask for guidance", accent: "id", detailsHref: "/services/nin-assistance" },
  { id: "06", label: "WAEC & NECO Services", description: "Assistance checking examination results and scratch cards where available. Call to confirm details.", icon: FileText, action: "Check availability", accent: "exam", detailsHref: "/services/waec-neco" },
  { id: "07", label: "Computer Training", description: "Build practical computer skills with guided learning. Contact us for current training schedules.", icon: GraduationCap, action: "Ask about training", accent: "learn", detailsHref: "/services/computer-training" },
  { id: "08", label: "Agreement & Documents", description: "Careful typing, arrangement and formatting for agreement documents and business paperwork.", icon: BookOpen, action: "Discuss a document", accent: "docs" },
  { id: "09", label: "Website Design & Development", description: "Modern, responsive websites for businesses, personal brands and organisations — designed to look great and work across devices.", icon: Globe2, action: "Discuss a website", accent: "web", featured: true },
  { id: "10", label: "Mobile App Development", description: "Have an app idea? Let's discuss the design and development of a mobile experience built around your goals and audience.", icon: TabletSmartphone, action: "Discuss a mobile app", accent: "mobile", featured: true },
];
const fallbackBenefits = [
  { no: "01", title: "People first.", text: "Friendly, practical assistance from a team that takes time to understand what you need." },
  { no: "02", title: "Details matter.", text: "Thoughtful attention to typing, formatting, copying and every finished page." },
  { no: "03", title: "Made convenient.", text: "A useful range of digital and document services in one accessible Benin City location." },
];

const iconLookup: Record<string, LucideIcon> = {
  FilePenLine, ScanLine, Camera, Smartphone, IdCard, FileText, GraduationCap,
  BookOpen, Globe2, TabletSmartphone,
};

function Logo({ light = false }: { light?: boolean }) {
  return <a href="#home" aria-label="Supreme Computer home" className={`brand ${light ? "brand-light" : ""}`}><span className="brand-symbol" aria-hidden="true"><span/><span/><span/></span><span className="brand-name">SUPREME <strong>COMPUTER</strong></span></a>;
}
function Eyebrow({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span>{number}</span><i/>{children}</p>;
}
function ServiceCard({ service, phone = PRIMARY_PHONE }: { service: Service; phone?: string }) {
  const Icon = service.icon;
  return <article className={`service-card service-${service.accent}${service.featured ? " service-card-featured" : ""}`} data-reveal>
    <div className="service-card-top"><span className="service-icon"><Icon size={26} strokeWidth={1.6}/></span><span className="service-number">/{service.id}</span></div>
    <div className="service-card-copy"><h3>{service.label}</h3><p>{service.description}</p></div>
    <div className="service-card-actions">
      <a href={service.detailsHref ?? phone} className="service-action" aria-label={service.detailsHref ? `Read more about ${service.label}` : `${service.action} by phone`}>{service.detailsHref ? "View service details" : service.action}<ArrowUpRight size={17} strokeWidth={1.8}/></a>
      {service.detailsHref && <a className="service-quick-call" href={phone} aria-label={`Call Supreme Computer about ${service.label}`}>Call now</a>}
    </div>
  </article>;
}

function formatTime(value: string | null | undefined) {
  if (!value) return "—";
  const parts = value.split(":");
  const hour = Number(parts[0]);
  return `${hour % 12 || 12}:${parts[1]} ${hour >= 12 ? "PM" : "AM"}`;
}

export default async function Home() {
  const content = await getSiteContent();
  const services = content ? content.services.map((service) => ({ ...service, icon: iconLookup[service.iconKey] || FileText })) : fallbackServices;
  const benefits = content?.benefits || fallbackBenefits;
  const steps = content?.processSteps || [
    { no: "01", title: "Find your service", text: "Explore our range of printing, document and computer services.", iconKey: "FileText" },
    { no: "02", title: "Get in touch", text: "Call us to confirm requirements, availability or pricing.", iconKey: "Phone" },
    { no: "03", title: "Visit our centre", text: "Find us at Km 2, Upper Siluko Road, Akpata, Benin City.", iconKey: "MapPin" },
  ];
  const t = (key: string, fallback: string) => content ? (content.copy[`home.${key}`] || fallback) : fallback;
  const globalText = (key: string, fallback: string) => content ? (content.copy[`global.${key}`] || fallback) : fallback;
  const navText = (key: string, fallback: string) => content ? (content.copy[`nav.${key}`] || fallback) : fallback;
  const contactSectionText = (key: string, fallback: string) => content ? (content.copy[`contact_section.${key}`] || fallback) : fallback;
  const footerText = (key: string, fallback: string) => content ? (content.copy[`footer.${key}`] || fallback) : fallback;
  const marqueeText = content?.copy?.['marquee.text'] || "TYPING & TYPESETTING ✳ PRINTING & SCANNING ✳ PASSPORT PHOTOS ✳ COMPUTER TRAINING ✳ WEBSITE DESIGN ✳ MOBILE APP DEVELOPMENT ✳";
  const phone = content?.settings?.primary_phone ? `tel:${content.settings.primary_phone.replace(/\D/g, "").replace(/^0/, "+234")}` : PRIMARY_PHONE;
  const secondaryPhone = content?.settings?.secondary_phone ? `tel:${content.settings.secondary_phone.replace(/\D/g, "").replace(/^0/, "+234")}` : SECONDARY_PHONE;
  const firstPhoneLabel = content?.settings?.primary_phone || "08152404200";
  const secondaryPhoneLabel = content?.settings?.secondary_phone || "08084160376";
  const email = content?.settings?.email || EMAIL;
  const whatsapp = content?.settings?.primary_whatsapp ? `https://wa.me/${content.settings.primary_whatsapp.replace(/\D/g, "")}` : WHATSAPP_PRIMARY;
  const secondaryWhatsapp = content?.settings?.secondary_whatsapp ? `https://wa.me/${content.settings.secondary_whatsapp.replace(/\D/g, "")}` : WHATSAPP_SECONDARY;
  const address = content?.settings?.address || ADDRESS;
  const directions = content?.settings?.maps_url || DIRECTIONS;
  const openingHours = content?.hours?.length ? content.hours : null;
  const scheduleText = openingHours && openingHours.length === 7
    ? `Monday–Saturday · ${formatTime(openingHours[1]?.opens_at)}–${formatTime(openingHours[6]?.closes_at)}`
    : "Monday–Saturday · 8:00 AM–5:00 PM";
  return <>
    <ScrollSystem/>
    <div className="site-shell" id="home">
      <div className="top-strip"><div className="container top-strip-inner"><span><MapPin size={12}/> {content?.settings?.locality || "Akpata"}, {content?.settings?.city || "Benin City"}, {content?.settings?.region || "Edo State"}</span><span className="top-strip-side">{scheduleText} <span className="top-strip-star">✳</span></span></div></div>
      <header className="site-header"><div className="container header-inner">
        <Logo/>
        <nav className="desktop-nav" aria-label="Main navigation"><a href="#home">{navText("home", "Home")}</a><a href="#services">{navText("services", "Services")}</a><a href="#about">{navText("about", "About us")}</a><a href="#contact">{navText("contact", "Contact")}</a></nav>
        <div className="header-actions"><a href={phone} className="btn btn-primary header-call"><Phone size={15} fill="currentColor"/> {navText("call_now", "Call now")} <ArrowUpRight size={15}/></a><MobileNav basePath="" navLinks={[
          { href: "#home", label: navText("home", "Home") },
          { href: "#services", label: navText("services", "Services") },
          { href: "#about", label: navText("about", "About us") },
          { href: "#contact", label: navText("contact", "Contact") },
        ]} callLabel={navText("call_now", "Call now")} /></div>
      </div></header>
      <main id="main-content">
        <GlyphPortal
          className="supreme-portal hero-portal"
          word="SUPREME"
          focusChar="P"
          interactive
          scrollLength={1.55}
          fontFamily='"Arial Black", Arial, sans-serif'
          fontWeight={900}
          enterLabel="Explore what we do"
          style={{ "--gp-paper": "#f4f8ef", "--gp-ink": "#123a25", "--gp-field": "#0d3b29", "--gp-foreground": "#f1f9eb" }}
          background={<div className="portal-scene" aria-hidden="true">
            <span className="portal-light portal-light-one"/><span className="portal-light portal-light-two"/><span className="portal-orbit"/><span className="portal-scene-word">SC / 001</span>
            <div className="hero-portal-art hero-art-frame"><div className="art-grid"/><div className="hero-canvas-fallback"><span className="fallback-paper paper-one"/><span className="fallback-paper paper-two"/><span className="fallback-printer"/></div><HeroScene/></div>
          </div>}
          front={<div className="portal-front hero-front">
            <div className="portal-front-top"><span>{t("hero_intro", "YOUR NEIGHBOURHOOD DIGITAL DESK")}</span><span>{t("hero_location", "BENIN CITY — NIGERIA")}</span></div>
            <div className="hero-front-message"><h1 id="hero-heading">{t("hero_title_lead", "Every detail.")} <em>{t("hero_title_accent", "Done right.")}</em></h1><p>{t("hero_description", "Printing, documents, website design & mobile apps — all in one place.")}</p><a href={phone} className="hero-front-contact">{t("hero_action", "Let's talk")} <ArrowUpRight size={16}/></a></div>
          </div>}
        >
          <div className="hero-final-content container">
            <div className="hero-final-copy">
              <span className="hero-final-kicker">SUPREME COMPUTER <i/> TEN WAYS TO HELP</span>
              <p>{t("hero_reveal_lead", "From paper to pixels.")}<br/><em>{t("hero_reveal_accent", "We'll help you make it happen.")}</em></p>
              <a className="btn btn-white" href="#services">Explore all services <ArrowUpRight size={18}/></a>
            </div>
            <span className="hero-final-index" aria-hidden="true">BENIN CITY / NIGERIA — 001</span>
          </div>
        </GlyphPortal>
        <div className="marquee-bar" aria-label="Our key services"><div className="marquee-content" aria-hidden="true">{Array.from({ length: 2 }).map((_,i)=><span key={i} className="marquee-group">{marqueeText}</span>)}</div></div>

        <section className="services-section section-pad" id="services" aria-labelledby="services-title"><div className="container">
          <div className="section-intro" data-reveal><div><Eyebrow number="01">OUR EXPERTISE</Eyebrow><h2 id="services-title">{t("services_title_lead", "Everyday essentials.")}<br/><em>{t("services_title_accent", "Expertly handled.")}</em></h2></div><p>{t("services_intro", "Printing, documents, computer training — and now website design and mobile app development. Explore all ten ways we can help.")}</p></div>
          <div className="services-grid">{services.map(s=><ServiceCard key={s.id} service={s} phone={phone}/>)}</div>
          <p className="services-disclaimer">{t("services_disclaimer", "For NIN-related and examination services, availability and applicable official requirements must be confirmed with our team.")}</p>
        </div></section>

        <section className="why-section" id="about" aria-labelledby="why-title"><div className="why-decor why-decor-one"/><div className="why-decor why-decor-two"/><div className="container why-layout">
          <div className="why-lead" data-reveal><Eyebrow number="02" light>WHY SUPREME COMPUTER</Eyebrow><h2 id="why-title">{t("why_title_lead", "Good service is in the")} <em>{t("why_title_accent", "details.")}</em></h2><p>{t("why_description", "We believe getting things done should feel straightforward. Quality work, helpful people and practical support — all under one roof.")}</p><a className="btn btn-white" href="#contact">Find us in Benin City <ArrowUpRight size={18}/></a><span className="why-watermark" aria-hidden="true">SC.</span></div>
          <div className="why-points">{benefits.map(b=><div className="why-point" key={b.no} data-reveal><span>{b.no}</span><div><h3>{b.title}</h3><p>{b.text}</p></div><ArrowUpRight size={20}/></div>)}</div>
        </div></section>

        <section className="process-section section-pad" id="how-it-works" aria-labelledby="process-title"><div className="container process-layout">
          <div className="process-intro" data-reveal><Eyebrow number="03">HOW IT WORKS</Eyebrow><h2 id="process-title">{t("process_title_lead", "Simple from")}<br/><em>{t("process_title_accent", "start to finish.")}</em></h2><p>{t("process_description", "No complicated steps. Just tell us what you need and we'll help you find the right way forward.")}</p><a className="text-link" href={phone}>Have a question? Call us <ArrowUpRight size={18}/></a></div>
          <div className="steps-grid">{steps.map((step) => {
            const StepIcon = iconLookup[step.iconKey] || MapPin;
            return <div className="step" data-reveal key={step.no}><div className="step-graphic"><StepIcon size={51} strokeWidth={1.1}/><span>{step.no}</span></div><h3>{step.title}</h3><p>{step.text}</p></div>;
          })}</div>
        </div></section>

        <section className="training-section" aria-labelledby="training-title"><div className="container training-inner">
          <div className="training-art" aria-hidden="true"><div className="training-orbit"/><div className="monitor-screen"><div className="monitor-top"><span/><span/><span/></div><div className="monitor-code"><i/><i/><i/><i/><i/></div><div className="monitor-badge"><GraduationCap size={22}/></div></div><div className="monitor-neck"/><div className="monitor-stand"/><span className="training-symbol">✳</span></div>
          <div className="training-copy" data-reveal><Eyebrow number="04">KEEP GROWING</Eyebrow><h2 id="training-title">{t("training_title_lead", "New skills.")}<br/><em>{t("training_title_accent", "New possibilities.")}</em></h2><p>{t("training_description", "Ready to feel more confident with computers? Ask about our practical computer training services and current schedules.")}</p><a className="btn btn-primary" href={phone}>Ask about training <ArrowUpRight size={18}/></a></div>
        </div></section>

        <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title"><div className="container contact-layout">
          <div className="contact-heading" data-reveal><Eyebrow number="05">GET IN TOUCH</Eyebrow><h2 id="contact-title">{t("contact_title_lead", "Let's get it")}<br/><em>{t("contact_title_accent", "sorted.")}</em></h2><p>{t("contact_description", "Questions about a service? Need help with a document? We'd love to hear from you.")}</p><div className="contact-cta"><a className="btn btn-primary btn-large" href={phone}><Phone size={17}/> Call Supreme Computer <ArrowUpRight size={17}/></a><a className="btn btn-outline btn-large" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> WhatsApp us <ArrowUpRight size={17}/></a></div></div>
          <div className="contact-card" data-reveal><div className="contact-card-head"><span>{contactSectionText("card_head", "CONTACT DETAILS")}</span><span className="contact-status"><span/> {contactSectionText("card_status", "BENIN CITY, NIGERIA")}</span></div>
            <div className="contact-detail"><span className="contact-detail-icon"><Phone size={22}/></span><div><span className="detail-label">{contactSectionText("label_call", "GIVE US A CALL")}</span><a href={phone}>{firstPhoneLabel} <ArrowUpRight size={17}/></a>{content?.settings?.secondary_phone !== null && <a href={secondaryPhone}>{secondaryPhoneLabel} <ArrowUpRight size={17}/></a>}</div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><MessageCircle size={23}/></span><div><span className="detail-label">{contactSectionText("label_whatsapp", "CHAT ON WHATSAPP")}</span><a className="whatsapp-link" href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp: {firstPhoneLabel} <ArrowUpRight size={17}/></a>{content?.settings?.secondary_whatsapp !== null && <a className="whatsapp-link" href={secondaryWhatsapp} target="_blank" rel="noopener noreferrer">WhatsApp: {secondaryPhoneLabel} <ArrowUpRight size={17}/></a>}</div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><Mail size={22}/></span><div><span className="detail-label">{contactSectionText("label_email", "EMAIL SUPREME COMPUTER")}</span><a className="email-link" href={`mailto:${email}`}>{email} <ArrowUpRight size={17}/></a></div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><Clock3 size={22}/></span><div><span className="detail-label">{contactSectionText("label_hours", "OPENING HOURS")}</span>{openingHours ? <p className="hours-value">{openingHours.slice(1).map((day) => <span key={day.weekday} style={{ display: "block" }}>{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day.weekday]}: <strong>{day.is_closed ? "Closed" : `${formatTime(day.opens_at)} – ${formatTime(day.closes_at)}`}</strong></span>)}<span>Sunday: <strong className="hours-closed">{openingHours[0]?.is_closed ? "Closed" : `${formatTime(openingHours[0]?.opens_at)} – ${formatTime(openingHours[0]?.closes_at)}`}</strong></span></p> : <p className="hours-value">Monday – Saturday<br/><strong>8:00 AM – 5:00 PM</strong><br/>Sunday: <strong className="hours-closed">Closed</strong></p>}</div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><MapPin size={23}/></span><div><span className="detail-label">{contactSectionText("label_visit", "VISIT OUR CENTRE")}</span><address>{address}</address><a className="contact-directions" href={directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17}/></a></div></div>
            <div className="contact-card-bottom"><span>{contactSectionText("card_bottom", "YOU BRING THE TASK. WE'LL HELP WITH THE DETAILS.")}</span><span>✳</span></div>
          </div>
        </div><div className="container"><ContactForm services={[["general", content?.copy?.["contact.service_general"] || "General enquiry"], ...services.map((service): [string,string] => [`S${service.id}`, service.label])]} recipient={email} copy={content?.copy || {}}/></div></section>
        <section className="closing-band"><div className="container closing-inner"><span className="closing-icon">✳</span><h2>{t("closing_lead", "Need something printed, typed or")}<br/><em>{t("closing_accent", "sorted?")}</em></h2><a href={phone} className="closing-round-link" aria-label="Call Supreme Computer"><ArrowUpRight size={30}/></a></div></section>
      </main>
      <footer className="site-footer"><div className="container footer-top"><div><Logo light/><p>{globalText("footer_description", "Printing, documents, computer training, website design and mobile app development — with a personal touch in Benin City.")}</p></div><div className="footer-nav"><div><h3>{footerText("explore_heading", "EXPLORE")}</h3><a href="#home">{navText("home", "Home")}</a><a href="#services">Our services</a><a href="#about">{navText("about", "About us")}</a><a href="#contact">{navText("contact", "Contact")}</a></div><div><h3>{footerText("contact_heading", "CONTACT")}</h3><a href={phone}>{firstPhoneLabel}</a>{content?.settings?.secondary_phone !== null && <a href={secondaryPhone}>{secondaryPhoneLabel}</a>}<a href={`mailto:${email}`}>{email}</a><a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp: {firstPhoneLabel} <ArrowUpRight size={13}/></a>{content?.settings?.secondary_whatsapp !== null && <a href={secondaryWhatsapp} target="_blank" rel="noopener noreferrer">WhatsApp: {secondaryPhoneLabel} <ArrowUpRight size={13}/></a>}<span className="footer-hours">{scheduleText}</span><a href={directions} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={13}/></a></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Supreme Computer. All rights reserved.</span><span>{globalText("footer_note", "Made with care in Benin City")} <span className="footer-star">✳</span></span><a href="/privacy">{footerText("privacy_link", "Privacy & enquiries")}</a></div></footer>
    </div>
  </>;
}
