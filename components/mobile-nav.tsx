"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";

const links = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About us" },
  { href: "#contact", label: "Contact" },
];

export default function MobileNav({ basePath = "" }: { basePath?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  return <>
    <button className="mobile-menu-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-controls="mobile-nav" aria-expanded={open} onClick={() => setOpen(!open)}>
      {open ? <X size={22} /> : <Menu size={22} />}
    </button>
    {open && <div className="mobile-panel" id="mobile-nav">
      <nav aria-label="Mobile navigation">
        {links.map(link => <a href={`${basePath}${link.href}`} key={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
      </nav>
      <a className="btn btn-primary" href="tel:+2348152404200" onClick={() => setOpen(false)}><Phone size={17}/> Call now <ArrowUpRight size={17}/></a>
    </div>}
  </>;
}
