import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, Check, Clock3, FileCheck2, GraduationCap, IdCard, MapPin, MessageCircle, Phone, Smartphone, type LucideIcon } from "lucide-react";
import MobileNav from "@/components/mobile-nav";
import { serviceDetails, type ServiceDetail } from "@/lib/service-details";
import type { MediaAsset, OpeningHour, SiteSettings } from "@/lib/supabase-content";

const PRIMARY_PHONE = "tel:+2348152404200";
const SECONDARY_PHONE = "tel:+2348084160376";
const ADDRESS = "Km 2, Upper Siluko Road, Akpata, Benin City, Edo State, Nigeria.";
const DIRECTIONS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

const icons: Record<ServiceDetail["art"], LucideIcon> = {
  passport: Camera, phone: Smartphone, nin: IdCard, exams: FileCheck2, training: GraduationCap,
};

const serviceArtwork: Partial<Record<ServiceDetail["art"], { src: string; width: number; height: number }>> = {
  nin: { src: "/images/nin-cards.svg", width: 1580, height: 995 },
  passport: { src: "/images/passport-camera.svg", width: 1254, height: 1254 },
  phone: { src: "/images/printing-printer.svg", width: 1381, height: 1139 },
  exams: { src: "/images/waec-laptop-phone.svg", width: 1536, height: 1024 },
};

function Brand({ light = false }: { light?: boolean }) {
  return <a href="/" aria-label="Supreme Computer home" className={`brand ${light ? "brand-light" : ""}`}>
    <span className="brand-symbol" aria-hidden="true"><span/><span/><span/></span>
    <span className="brand-name">SUPREME <strong>COMPUTER</strong></span>
  </a>;
}

function openingTime(value: string | null) {
  if (!value) return "—";
  const [hours, minutes] = value.split(":");
  const hour = Number(hours);
  return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? "PM" : "AM"}`;
}

export default function ServiceDetailPage({ service, relatedServices = serviceDetails, settings, hours, media = {}, copy = {} }: { service: ServiceDetail; relatedServices?: ServiceDetail[]; settings?: SiteSettings | null; hours?: OpeningHour[]; media?: Record<string, MediaAsset>; copy?: Record<string, string> }) {
  const t = (key: string, fallback: string) => copy[`service_detail.${key}`] || fallback;
  const navText = (key: string, fallback: string) => copy[`nav.${key}`] || fallback;
  const footerText = (key: string, fallback: string) => copy[`footer.${key}`] || fallback;
  const Icon = icons[service.art];
  const mediaKey = { nin: "nin_cards", passport: "passport_camera", phone: "printing_printer", exams: "waec_laptop_phone", training: "" }[service.art];
  const dbArtwork = media[mediaKey];
  const artwork = dbArtwork ? { src: dbArtwork.file_url, width: dbArtwork.width || 1200, height: dbArtwork.height || 900 } : serviceArtwork[service.art];
  const firstPhone = settings?.primary_phone ? `tel:${settings.primary_phone.replace(/\D/g, "").replace(/^0/, "+234")}` : PRIMARY_PHONE;
  const secondPhone = settings?.secondary_phone ? `tel:${settings.secondary_phone.replace(/\D/g, "").replace(/^0/, "+234")}` : SECONDARY_PHONE;
  const firstWhatsapp = settings?.primary_whatsapp?.replace(/\D/g, "") || "2348152404200";
  const whatsapp = `https://wa.me/${firstWhatsapp}?text=${encodeURIComponent(`Hello Supreme Computer, I would like to ask about ${service.title}.`)}`;
  const address = settings?.address || ADDRESS;
  const directions = settings?.maps_url || DIRECTIONS;
  const related = relatedServices.filter((item) => item.slug !== service.slug);
  const openDays = hours?.length === 7 ? hours : null;
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const conciseHours = openDays
    ? `Monday–Saturday · ${openingTime(openDays.find((d) => d.weekday === 1)?.opens_at || null)}–${openingTime(openDays.find((d) => d.weekday === 6)?.closes_at || null)}`
    : "Monday–Saturday · 8:00 AM–5:00 PM";

  return <div className="site-shell service-detail-site">
    <div className="top-strip"><div className="container top-strip-inner"><span><MapPin size={12}/> {settings?.locality || "Akpata"}, {settings?.city || "Benin City"}, {settings?.region || "Edo State"}</span><span className="top-strip-side">{conciseHours} <span className="top-strip-star">✳</span></span></div></div>
    <header className="site-header"><div className="container header-inner">
      <Brand/>
      <nav className="desktop-nav" aria-label="Main navigation"><a href="/#home">{navText("home", "Home")}</a><a href="/#services">{navText("services", "Services")}</a><a href="/#about">{navText("about", "About us")}</a><a href="/#contact">{navText("contact", "Contact")}</a></nav>
      <div className="header-actions"><a href={firstPhone} className="btn btn-primary header-call"><Phone size={15}/> {navText("call_now", "Call now")} <ArrowUpRight size={15}/></a><MobileNav basePath="/" navLinks={[
        { href: "/#home", label: navText("home", "Home") },
        { href: "/#services", label: navText("services", "Services") },
        { href: "/#about", label: navText("about", "About us") },
        { href: "/#contact", label: navText("contact", "Contact") },
      ]} callLabel={navText("call_now", "Call now")} /></div>
    </div></header>

    <main id="main-content">
      <section className="detail-hero" aria-labelledby="detail-heading">
        <div className="container detail-breadcrumb"><a href="/#services"><ArrowLeft size={15}/> {t("breadcrumb", "All services")}</a><span aria-hidden="true">/</span><span>{service.title}</span></div>
        <div className="container detail-hero-layout">
          <div className="detail-hero-copy">
            <div className="detail-kicker"><span>{service.number} / 10</span><i/>{service.category}</div>
            <h1 id="detail-heading">{service.titleLead}<br/><em>{service.titleAccent}</em></h1>
            <p>{service.summary}</p>
            <div className="detail-hero-actions"><a href={firstPhone} className="btn btn-primary btn-large"><Phone size={17}/> Call about this service <ArrowUpRight size={17}/></a><a href={whatsapp} className="detail-whatsapp" target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> Ask on WhatsApp <ArrowUpRight size={16}/></a></div>
          </div>
          <div className={`detail-art detail-art-${service.art} ${artwork ? "detail-art-has-image" : ""}`} aria-hidden="true">
            <div className="detail-art-halo"/><div className="detail-art-grid"/>
            {artwork
              ? <img className="detail-art-photo" src={artwork.src} alt="" width={artwork.width} height={artwork.height} decoding="async"/>
              : <div className="detail-art-shape"><Icon size={150} strokeWidth={1.05}/></div>}
            <span className="detail-art-label">{service.visualLabel}</span><span className="detail-art-number">SC—{service.number}</span>
          </div>
        </div>
      </section>

      <section className="detail-content-section" aria-label={`${service.title} information`}>
        <div className="container detail-main-grid">
          <div className="detail-main-content">
            <div className="detail-intro"><span className="detail-section-marker">{t("section_marker", "THE SERVICE / 01")}</span><h2>{t("intro_heading", "A little more")}<br/><em>about this service.</em></h2><p>{service.overview}</p></div>
            {service.art === "exams" && <div className="detail-exam-feature">
              <div className="detail-exam-feature-copy"><span>{t("exam_feature_label", "NECO / RESULT SUPPORT")}</span><h3>{t("exam_feature_heading", "Help checking")}<br/><em>NECO results.</em></h3><p>{t("exam_feature_body", "Bring your examination details and ask our team for guidance on the relevant result-checking process.")}</p><small>{t("exam_feature_disclaimer", "Illustrative laptop preview. We are an assistance centre, not an official examination portal.")}</small></div>
              <img src={media.neco_laptop?.file_url || "/images/neco-laptop.svg"} width={media.neco_laptop?.width || 1536} height={media.neco_laptop?.height || 1024} alt={media.neco_laptop?.alt_text || "Illustration of a laptop showing a NECO result-checking screen"} loading="lazy" decoding="async"/>
            </div>}
            <div className="detail-block" id="we-can-help"><div className="detail-block-header"><span>{t("help_marker", "01 / WHAT WE CAN HELP WITH")}</span><h2>{t("help_heading", "How we can help.")}</h2></div>
              <div className="detail-help-list">{service.helps.map((item,i)=><div className="detail-help-item" key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><Check size={19}/></div>)}</div>
            </div>
            <div className="detail-block" id="prepare"><div className="detail-block-header"><span>{t("prepare_marker", "02 / BEFORE YOUR VISIT")}</span><h2>{t("prepare_heading", "Come prepared.")}</h2></div>
              <ul className="detail-prepare-list">{service.prepare.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ul>
            </div>
            <div className="detail-block" id="steps"><div className="detail-block-header"><span>{t("steps_marker", "03 / SIMPLE PROCESS")}</span><h2>{t("steps_heading", "How it works.")}</h2></div>
              <div className="detail-steps">{service.steps.map((item,i)=><div className="detail-step" key={item.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
            </div>
            <div className="detail-note"><span>{t("good_to_know", "GOOD TO KNOW")} <ArrowUpRight size={15}/></span><p>{service.important}</p></div>
            <div className="detail-block detail-faqs"><div className="detail-block-header"><span>{t("faq_section_marker", "04 / COMMON QUESTIONS")}</span><h2>{t("faq_heading", "Good questions.")}</h2></div>
              {service.faqs.map((item)=><details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
            </div>
          </div>

          <aside className="detail-aside" aria-label="Visit Supreme Computer">
            <div className="detail-aside-inner"><span className="detail-aside-kicker">{t("aside_kicker", "NEED A HAND?")} <i>✳</i></span><h2>{t("aside_heading", "Let's get it sorted.")}<br/><em></em></h2><p>{t("aside_body", "Call our centre to confirm availability, pricing and anything you need to bring.")}</p>
              <a href={firstPhone} className="detail-aside-phone"><Phone size={19}/> {settings?.primary_phone || "0815 240 4200"} <ArrowUpRight size={16}/></a>
              {settings?.secondary_phone !== null && <a href={secondPhone} className="detail-aside-phone"><Phone size={19}/> {settings?.secondary_phone || "0808 416 0376"} <ArrowUpRight size={16}/></a>}
              <div className="detail-aside-info"><Clock3 size={18}/><span>{openDays ? openDays.map((day) => <span key={day.weekday} style={{ display: "block" }}>{days[day.weekday]}: <strong>{day.is_closed ? "Closed" : `${openingTime(day.opens_at)} – ${openingTime(day.closes_at)}`}</strong></span>) : <>Monday – Saturday<br/><strong>8:00 AM – 5:00 PM</strong><br/>Sunday: Closed</>}</span></div>
              <div className="detail-aside-info"><MapPin size={18}/><span>{address}</span></div>
              <a href={directions} target="_blank" rel="noopener noreferrer" className="detail-aside-directions">{t("aside_directions", "Get directions")} <ArrowUpRight size={15}/></a>
            </div>
          </aside>
        </div>
      </section>

      {service.trainingTopics && <section className="detail-training-section" aria-labelledby="training-topics-heading">
        <div className="container">
          <div className="detail-training-heading"><span className="detail-section-marker">{t("training_marker", "YOUR DIGITAL TOOLKIT / 02")}</span><h2 id="training-topics-heading">{t("training_heading", "What can you actually do with these skills?")}<br/><em></em></h2><p>{t("training_description", "From everyday documents to creative designs, here are practical ways to use the applications covered by our courses.")}</p></div>
          <div className="detail-training-topics">{service.trainingTopics.map((topic, i) => <article className="detail-training-topic" key={topic.name}>
            <div className="detail-training-topic-top"><span>0{i+1}</span><span>{topic.duration}</span></div>
            <h3>{topic.name}</h3><h4>{topic.lead}</h4><p>{topic.description}</p>
            <ul>{topic.examples.map(example => <li key={example}><Check size={14}/>{example}</li>)}</ul>
          </article>)}</div>
          <div className="detail-training-reel">
            <div className="detail-training-reel-copy"><span>{t("reel_marker", "18 SECONDS / REEL PREVIEW")}</span><h3>{t("reel_heading", "See where your skills can take you.")}<br/><em></em></h3><p>{t("reel_description", "A quick look at writing, organising, presenting and designing. Watch the vertical reel here, or download it to share.")}</p><a href={media.training_reel?.file_url || "/videos/supreme-computer-training-reel.mp4"} download="Supreme-Computer-Training-Reel.mp4" className="btn btn-primary">{t("reel_download", "Download the Reel")} <ArrowUpRight size={17}/></a></div>
            <figure className="detail-training-reel-media"><video controls playsInline muted loop preload="metadata" poster={media.training_poster?.file_url || "/videos/supreme-computer-training-poster.png"} aria-label="Eighteen-second Supreme Computer training promotion showing Word, Excel, PowerPoint and CorelDRAW"><source src={media.training_reel?.file_url || "/videos/supreme-computer-training-reel.mp4"} type="video/mp4"/>{t("reel_caption", "Vertical 9:16 video · no audio")}</video><figcaption>{t("reel_caption", "Vertical 9:16 video · no audio")}</figcaption></figure>
          </div>
        </div>
      </section>}

      <section className="detail-related" aria-labelledby="related-services-heading"><div className="container">
        <div className="detail-related-top"><div><span className="detail-section-marker">{t("related_marker", "KEEP EXPLORING")}</span><h2 id="related-services-heading">{t("related_heading", "You may also need these.")}<br/><em></em></h2></div><a href="/#services">{t("related_view_all", "View all ten services")} <ArrowUpRight size={17}/></a></div>
        <div className="detail-related-grid">{related.map((item)=><a href={`/services/${item.slug}`} key={item.slug} className="detail-related-link"><span>/{item.number}</span><strong>{item.title}</strong><ArrowRight size={19}/></a>)}</div>
      </div></section>
      <section className="detail-closing"><div className="container detail-closing-inner"><span>{t("closing_location", "SUPREME COMPUTER / BENIN CITY")}</span><h2>{t("closing_prefix", "Need help with")}<br/><em>{service.title.toLowerCase()}?</em></h2><a className="btn btn-white btn-large" href={whatsapp} target="_blank" rel="noopener noreferrer">{t("closing_action", "Start a conversation")} <ArrowUpRight size={19}/></a></div></section>
    </main>

    <footer className="site-footer detail-footer"><div className="container detail-footer-main"><div><Brand light/><p>{t("detail_footer_description", "Printing, computer support and digital services with a personal touch in Benin City.")}</p></div><div><h3>{footerText("find_us_heading", "FIND US")}</h3><p>{address}</p><a href={directions} target="_blank" rel="noopener noreferrer">{t("detail_directions", "Directions")} <ArrowUpRight size={14}/></a></div><div><h3>{footerText("detail_contact_heading", "CONTACT")}</h3><a href={firstPhone}>{settings?.primary_phone || "08152404200"}</a>{settings?.secondary_phone !== null && <a href={secondPhone}>{settings?.secondary_phone || "08084160376"}</a>}<a href={`mailto:${settings?.email || "computersupreme0@gmail.com"}`}>{settings?.email || "computersupreme0@gmail.com"}</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Supreme Computer. All rights reserved.</span><a href="/">{footerText("back_to_home", "Back to home")} <ArrowUpRight size={13}/></a><a href="/privacy">{footerText("privacy_link", "Privacy & enquiries")}</a></div></footer>
  </div>;
}
