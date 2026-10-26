import { ArrowUpRight } from "lucide-react";
import Brand from "@/components/brand";
import { directionsUrl, siteConfig } from "@/lib/site-config";

/** Reusable footer for the home page and all service detail pages. */
export default function SiteFooter({ detail = false }: { detail?: boolean }) {
  if (detail) {
    return <footer className="site-footer detail-footer">
      <div className="container detail-footer-main">
        <div><Brand light/><p>Printing, computer support and digital services with a personal touch in Benin City.</p></div>
        <div><h3>FIND US</h3><p>{siteConfig.address}</p><a href={directionsUrl} target="_blank" rel="noopener noreferrer">Directions <ArrowUpRight size={14}/></a></div>
        <div><h3>CONTACT</h3>{siteConfig.phones.map(phone => <a href={phone.href} key={phone.href}>{phone.compact}</a>)}<a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Supreme Computer. All rights reserved.</span><a href="/">Back to home <ArrowUpRight size={13}/></a><a href="/privacy">Privacy &amp; enquiries</a></div>
    </footer>;
  }

  return <footer className="site-footer"><div className="container footer-top">
    <div><Brand light href="#home"/><p>Printing, documents, computer training, website design and mobile app development — with a personal touch in Benin City.</p></div>
    <div className="footer-nav"><div><h3>EXPLORE</h3><a href="#home">Home</a><a href="#services">Our services</a><a href="#about">About us</a><a href="#contact">Contact</a></div>
      <div><h3>CONTACT</h3>
        {siteConfig.phones.map(phone => <a href={phone.href} key={phone.href}>{phone.compact}</a>)}
        <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        {siteConfig.phones.map(phone => <a key={phone.whatsapp} href={phone.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp: {phone.compact} <ArrowUpRight size={13}/></a>)}
        <span className="footer-hours">Mon–Sat, 8:00 AM–5:00 PM</span>
        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">Get directions <ArrowUpRight size={13}/></a>
      </div>
    </div></div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Supreme Computer. All rights reserved.</span><span>Made with care in Benin City <span className="footer-star">✳</span></span><a href="/privacy">Privacy &amp; enquiries</a></div>
  </footer>;
}
