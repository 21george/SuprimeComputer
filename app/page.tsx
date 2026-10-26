import { ArrowUpRight, Clock3, Copy, FileText, GraduationCap, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import HeroScene from "@/components/hero-scene-loader";
import ScrollSystem from "@/components/scroll-system";
import ContactForm from "@/components/contact-form";
import GlyphPortal from "@/components/ui/glyph-portal";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import Eyebrow from "@/components/eyebrow";
import ServiceCard from "@/components/service-card";
import { services } from "@/lib/services";
import { directionsUrl, siteConfig } from "@/lib/site-config";

const PRIMARY_PHONE = siteConfig.phones[0].href;
const SECONDARY_PHONE = siteConfig.phones[1].href;
const EMAIL = siteConfig.email;
const WHATSAPP_PRIMARY = siteConfig.phones[0].whatsapp;
const WHATSAPP_SECONDARY = siteConfig.phones[1].whatsapp;
const ADDRESS = siteConfig.address;
const DIRECTIONS = directionsUrl;

const benefits = [
  { no: "01", title: "People first.", text: "Friendly, practical assistance from a team that takes time to understand what you need." },
  { no: "02", title: "Details matter.", text: "Thoughtful attention to typing, formatting, copying and every finished page." },
  { no: "03", title: "Made convenient.", text: "A useful range of digital and document services in one accessible Benin City location." },
];

export default function Home() {
  return <>
    <ScrollSystem/>
    <div className="site-shell" id="home">
      <SiteHeader home/>
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
            <div className="portal-front-top"><span>YOUR NEIGHBOURHOOD DIGITAL DESK</span><span>BENIN CITY — NIGERIA</span></div>
            <div className="hero-front-message"><h1 id="hero-heading">Every detail. <em>Done right.</em></h1><p>Printing, documents, website design &amp; mobile apps — all in one place.</p><a href={PRIMARY_PHONE} className="hero-front-contact">Let&apos;s talk <ArrowUpRight size={16}/></a></div>
          </div>}
        >
          <div className="hero-final-content container">
            <div className="hero-final-copy">
              <span className="hero-final-kicker">SUPREME COMPUTER <i/> TEN WAYS TO HELP</span>
              <p>From paper to pixels.<br/><em>We&apos;ll help you make it happen.</em></p>
              <a className="btn btn-white" href="#services">Explore all services <ArrowUpRight size={18}/></a>
            </div>
            <span className="hero-final-index" aria-hidden="true">BENIN CITY / NIGERIA — 001</span>
          </div>
        </GlyphPortal>
        <div className="marquee-bar" aria-label="Our key services"><div className="marquee-content" aria-hidden="true">{Array.from({ length: 2 }).map((_,i)=><span key={i} className="marquee-group">TYPING & TYPESETTING <i>✳</i> PRINTING & SCANNING <i>✳</i> PASSPORT PHOTOS <i>✳</i> COMPUTER TRAINING <i>✳</i> WEBSITE DESIGN <i>✳</i> MOBILE APP DEVELOPMENT <i>✳</i></span>)}</div></div>

        <section className="services-section section-pad" id="services" aria-labelledby="services-title"><div className="container">
          <div className="section-intro" data-reveal><div><Eyebrow number="01">OUR EXPERTISE</Eyebrow><h2 id="services-title">Everyday essentials.<br/><em>Expertly handled.</em></h2></div><p>Printing, documents, computer training — and now website design and mobile app development. Explore all ten ways we can help.</p></div>
          <div className="services-grid">{services.map(s=><ServiceCard key={s.id} service={s}/>)}</div>
          <p className="services-disclaimer">For NIN-related and examination services, availability and applicable official requirements must be confirmed with our team.</p>
        </div></section>

        <section className="why-section" id="about" aria-labelledby="why-title"><div className="why-decor why-decor-one"/><div className="why-decor why-decor-two"/><div className="container why-layout">
          <div className="why-lead" data-reveal><Eyebrow number="02" light>WHY SUPREME COMPUTER</Eyebrow><h2 id="why-title">Good service<br/>is in the <em>details.</em></h2><p>We believe getting things done should feel straightforward. Quality work, helpful people and practical support — all under one roof.</p><a className="btn btn-white" href="#contact">Find us in Benin City <ArrowUpRight size={18}/></a><span className="why-watermark" aria-hidden="true">SC.</span></div>
          <div className="why-points">{benefits.map(b=><div className="why-point" key={b.no} data-reveal><span>{b.no}</span><div><h3>{b.title}</h3><p>{b.text}</p></div><ArrowUpRight size={20}/></div>)}</div>
        </div></section>

        <section className="process-section section-pad" id="how-it-works" aria-labelledby="process-title"><div className="container process-layout">
          <div className="process-intro" data-reveal><Eyebrow number="03">HOW IT WORKS</Eyebrow><h2 id="process-title">Simple from<br/><em>start to finish.</em></h2><p>No complicated steps. Just tell us what you need and we&apos;ll help you find the right way forward.</p><a className="text-link" href={PRIMARY_PHONE}>Have a question? Call us <ArrowUpRight size={18}/></a></div>
          <div className="steps-grid">
            <div className="step" data-reveal><div className="step-graphic"><span className="files-icon"><FileText size={54} strokeWidth={1.1}/><Copy size={31} strokeWidth={1.2}/></span><span>01</span></div><h3>Find your service</h3><p>Explore our range of printing, document and computer services.</p></div>
            <div className="step" data-reveal><div className="step-graphic"><Phone size={48} strokeWidth={1.1}/><span>02</span></div><h3>Get in touch</h3><p>Call us to confirm requirements, availability or pricing.</p></div>
            <div className="step" data-reveal><div className="step-graphic"><MapPin size={51} strokeWidth={1.1}/><span>03</span></div><h3>Visit our centre</h3><p>Find us at Km 2, Upper Siluko Road, Akpata, Benin City.</p></div>
          </div>
        </div></section>

        <section className="training-section" aria-labelledby="training-title"><div className="container training-inner">
          <div className="training-art" aria-hidden="true"><div className="training-orbit"/><div className="monitor-screen"><div className="monitor-top"><span/><span/><span/></div><div className="monitor-code"><i/><i/><i/><i/><i/></div><div className="monitor-badge"><GraduationCap size={22}/></div></div><div className="monitor-neck"/><div className="monitor-stand"/><span className="training-symbol">✳</span></div>
          <div className="training-copy" data-reveal><Eyebrow number="04">KEEP GROWING</Eyebrow><h2 id="training-title">New skills.<br/><em>New possibilities.</em></h2><p>Ready to feel more confident with computers? Ask about our practical computer training services and current schedules.</p><a className="btn btn-primary" href={PRIMARY_PHONE}>Ask about training <ArrowUpRight size={18}/></a></div>
        </div></section>

        <section className="contact-section section-pad" id="contact" aria-labelledby="contact-title"><div className="container contact-layout">
          <div className="contact-heading" data-reveal><Eyebrow number="05">GET IN TOUCH</Eyebrow><h2 id="contact-title">Let&apos;s get it<br/><em>sorted.</em></h2><p>Questions about a service? Need help with a document? We&apos;d love to hear from you.</p><div className="contact-cta"><a className="btn btn-primary btn-large" href={PRIMARY_PHONE}><Phone size={17}/> Call Supreme Computer <ArrowUpRight size={17}/></a><a className="btn btn-outline btn-large" href={WHATSAPP_PRIMARY} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> WhatsApp us <ArrowUpRight size={17}/></a></div></div>
          <div className="contact-card" data-reveal><div className="contact-card-head"><span>CONTACT DETAILS</span><span className="contact-status"><span/> BENIN CITY, NIGERIA</span></div>
            <div className="contact-detail"><span className="contact-detail-icon"><Phone size={22}/></span><div><span className="detail-label">GIVE US A CALL</span><a href={PRIMARY_PHONE}>0815 240 4200 <ArrowUpRight size={17}/></a><a href={SECONDARY_PHONE}>0808 416 0376 <ArrowUpRight size={17}/></a></div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><MessageCircle size={23}/></span><div><span className="detail-label">CHAT ON WHATSAPP</span><a className="whatsapp-link" href={WHATSAPP_PRIMARY} target="_blank" rel="noopener noreferrer">WhatsApp: 0815 240 4200 <ArrowUpRight size={17}/></a><a className="whatsapp-link" href={WHATSAPP_SECONDARY} target="_blank" rel="noopener noreferrer">WhatsApp: 0808 416 0376 <ArrowUpRight size={17}/></a></div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><Mail size={22}/></span><div><span className="detail-label">EMAIL SUPREME COMPUTER</span><a className="email-link" href={`mailto:${EMAIL}`}>{EMAIL} <ArrowUpRight size={17}/></a></div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><Clock3 size={22}/></span><div><span className="detail-label">OPENING HOURS</span><p className="hours-value">Monday – Saturday<br/><strong>8:00 AM – 5:00 PM</strong><br/>Sunday: <strong className="hours-closed">Closed</strong></p></div></div>
            <div className="contact-detail"><span className="contact-detail-icon"><MapPin size={23}/></span><div><span className="detail-label">VISIT OUR CENTRE</span><address>{ADDRESS}</address><a className="contact-directions" href={DIRECTIONS} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={17}/></a></div></div>
            <div className="contact-card-bottom"><span>YOU BRING THE TASK. WE&apos;LL HELP WITH THE DETAILS.</span><span>✳</span></div>
          </div>
        </div><div className="container"><ContactForm/></div></section>
        <section className="closing-band"><div className="container closing-inner"><span className="closing-icon">✳</span><h2>Need something printed,<br/>typed or <em>sorted?</em></h2><a href={PRIMARY_PHONE} className="closing-round-link" aria-label="Call Supreme Computer"><ArrowUpRight size={30}/></a></div></section>
      </main>
      <SiteFooter/>
    </div>
  </>;
}
