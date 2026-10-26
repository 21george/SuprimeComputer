import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import type { Service } from "@/lib/services";

export default function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  return <article className={`service-card service-${service.accent}${service.featured ? " service-card-featured" : ""}`} data-reveal>
    <div className="service-card-top"><span className="service-icon"><Icon size={26} strokeWidth={1.6}/></span><span className="service-number">/{service.id}</span></div>
    <div className="service-card-copy"><h3>{service.label}</h3><p>{service.description}</p></div>
    <div className="service-card-actions">
      <a href={service.detailsHref ?? siteConfig.phones[0].href} className="service-action" aria-label={service.detailsHref ? `Read more about ${service.label}` : `${service.action} by phone`}>
        {service.detailsHref ? "View service details" : service.action}<ArrowUpRight size={17} strokeWidth={1.8}/>
      </a>
      {service.detailsHref && <a className="service-quick-call" href={siteConfig.phones[0].href} aria-label={`Call Supreme Computer about ${service.label}`}>Call now</a>}
    </div>
  </article>;
}
