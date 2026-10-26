import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, Check, Clock3, FileCheck2, GraduationCap, IdCard, MapPin, MessageCircle, Phone, Smartphone, type LucideIcon } from "lucide-react";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { serviceDetails, type ServiceDetail } from "@/lib/service-details";
import { directionsUrl, siteConfig, whatsappAbout } from "@/lib/site-config";

const PRIMARY_PHONE = siteConfig.phones[0].href;
const SECONDARY_PHONE = siteConfig.phones[1].href;
const ADDRESS = siteConfig.address;
const DIRECTIONS = directionsUrl;

const icons: Record<ServiceDetail["art"], LucideIcon> = {
  passport: Camera, phone: Smartphone, nin: IdCard, exams: FileCheck2, training: GraduationCap,
};

export default function ServiceDetailPage({ service }: { service: ServiceDetail }) {
  const Icon = icons[service.art];
  const whatsapp = whatsappAbout(service.title);
  const related = serviceDetails.filter((item) => item.slug !== service.slug);

  return <div className="site-shell service-detail-site">
    <SiteHeader/>

    <main id="main-content">
      <section className="detail-hero" aria-labelledby="detail-heading">
        <div className="container detail-breadcrumb"><a href="/#services"><ArrowLeft size={15}/> All services</a><span aria-hidden="true">/</span><span>{service.title}</span></div>
        <div className="container detail-hero-layout">
          <div className="detail-hero-copy">
            <div className="detail-kicker"><span>{service.number} / 10</span><i/>{service.category}</div>
            <h1 id="detail-heading">{service.titleLead}<br/><em>{service.titleAccent}</em></h1>
            <p>{service.summary}</p>
            <div className="detail-hero-actions"><a href={PRIMARY_PHONE} className="btn btn-primary btn-large"><Phone size={17}/> Call about this service <ArrowUpRight size={17}/></a><a href={whatsapp} className="detail-whatsapp" target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/> Ask on WhatsApp <ArrowUpRight size={16}/></a></div>
          </div>
          <div className={`detail-art detail-art-${service.art}`} aria-hidden="true">
            <div className="detail-art-halo"/><div className="detail-art-grid"/>
            <div className="detail-art-shape"><Icon size={150} strokeWidth={1.05}/></div>
            <span className="detail-art-label">{service.visualLabel}</span><span className="detail-art-number">SC—{service.number}</span>
          </div>
        </div>
      </section>

      <section className="detail-content-section" aria-label={`${service.title} information`}>
        <div className="container detail-main-grid">
          <div className="detail-main-content">
            <div className="detail-intro"><span className="detail-section-marker">THE SERVICE / 01</span><h2>A little more<br/><em>about this service.</em></h2><p>{service.overview}</p></div>
            <div className="detail-block" id="we-can-help"><div className="detail-block-header"><span>01 / WHAT WE CAN HELP WITH</span><h2>How we can help.</h2></div>
              <div className="detail-help-list">{service.helps.map((item,i)=><div className="detail-help-item" key={item.title}><span>0{i+1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div><Check size={19}/></div>)}</div>
            </div>
            <div className="detail-block" id="prepare"><div className="detail-block-header"><span>02 / BEFORE YOUR VISIT</span><h2>Come prepared.</h2></div>
              <ul className="detail-prepare-list">{service.prepare.map((item,i)=><li key={item}><span>{String(i+1).padStart(2,"0")}</span><p>{item}</p></li>)}</ul>
            </div>
            <div className="detail-block" id="steps"><div className="detail-block-header"><span>03 / SIMPLE PROCESS</span><h2>How it works.</h2></div>
              <div className="detail-steps">{service.steps.map((item,i)=><div className="detail-step" key={item.title}><span>{String(i+1).padStart(2,"0")}</span><h3>{item.title}</h3><p>{item.text}</p></div>)}</div>
            </div>
            <div className="detail-note"><span>GOOD TO KNOW <ArrowUpRight size={15}/></span><p>{service.important}</p></div>
            <div className="detail-block detail-faqs"><div className="detail-block-header"><span>04 / COMMON QUESTIONS</span><h2>Good questions.</h2></div>
              {service.faqs.map((item)=><details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}
            </div>
          </div>

          <aside className="detail-aside" aria-label="Visit Supreme Computer">
            <div className="detail-aside-inner"><span className="detail-aside-kicker">NEED A HAND? <i>✳</i></span><h2>Let&apos;s get it<br/><em>sorted.</em></h2><p>Call our centre to confirm availability, pricing and anything you need to bring.</p>
              <a href={PRIMARY_PHONE} className="detail-aside-phone"><Phone size={19}/> 0815 240 4200 <ArrowUpRight size={16}/></a>
              <a href={SECONDARY_PHONE} className="detail-aside-phone"><Phone size={19}/> 0808 416 0376 <ArrowUpRight size={16}/></a>
              <div className="detail-aside-info"><Clock3 size={18}/><span>Monday – Saturday<br/><strong>8:00 AM – 5:00 PM</strong><br/>Sunday: Closed</span></div>
              <div className="detail-aside-info"><MapPin size={18}/><span>{ADDRESS}</span></div>
              <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="detail-aside-directions">Get directions <ArrowUpRight size={15}/></a>
            </div>
          </aside>
        </div>
      </section>

      <section className="detail-related" aria-labelledby="related-services-heading"><div className="container">
        <div className="detail-related-top"><div><span className="detail-section-marker">KEEP EXPLORING</span><h2 id="related-services-heading">You may also<br/><em>need these.</em></h2></div><a href="/#services">View all ten services <ArrowUpRight size={17}/></a></div>
        <div className="detail-related-grid">{related.map((item)=><a href={`/services/${item.slug}`} key={item.slug} className="detail-related-link"><span>/{item.number}</span><strong>{item.title}</strong><ArrowRight size={19}/></a>)}</div>
      </div></section>
      <section className="detail-closing"><div className="container detail-closing-inner"><span>SUPREME COMPUTER / BENIN CITY</span><h2>Need help with<br/><em>{service.title.toLowerCase()}?</em></h2><a className="btn btn-white btn-large" href={whatsapp} target="_blank" rel="noopener noreferrer">Start a conversation <ArrowUpRight size={19}/></a></div></section>
    </main>

    <SiteFooter detail/>
  </div>;
}
