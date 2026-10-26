import { ArrowUpRight, MapPin, Phone } from "lucide-react";
import Brand from "@/components/brand";
import MobileNav from "@/components/mobile-nav";
import { siteConfig } from "@/lib/site-config";

export default function SiteHeader({ home = false }: { home?: boolean }) {
  const root = home ? "" : "/";
  return <>
    <div className="top-strip"><div className="container top-strip-inner">
      <span><MapPin size={12}/>{siteConfig.location}</span>
      <span className="top-strip-side">Monday–Saturday · 8:00 AM–5:00 PM <span className="top-strip-star">✳</span></span>
    </div></div>
    <header className="site-header"><div className="container header-inner">
      <Brand href={home ? "#home" : "/"}/>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href={`${root}#home`}>Home</a><a href={`${root}#services`}>Services</a>
        <a href={`${root}#about`}>About us</a><a href={`${root}#contact`}>Contact</a>
      </nav>
      <div className="header-actions">
        <a href={siteConfig.phones[0].href} className="btn btn-primary header-call"><Phone size={15}/> Call now <ArrowUpRight size={15}/></a>
        <MobileNav basePath={root}/>
      </div>
    </div></header>
  </>;
}
