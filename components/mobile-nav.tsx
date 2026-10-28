"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";

export default function MobileNav({ basePath = "", navLinks = [
  { href: "#home", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About us" },
  { href: "#contact", label: "Contact" },
], callLabel = "Call now" }: { basePath?: string; navLinks?: { href: string; label: string }[]; callLabel?: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        className="mobile-menu-button"
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-controls="mobile-nav"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div
        className="mobile-panel"
        id="mobile-nav"
        data-open={open || undefined}
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <button
          type="button"
          className="mobile-panel-close"
          aria-label="Close navigation"
          onClick={() => setOpen(false)}
        >
          <X size={24} />
        </button>
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => (
            <a
              href={`${basePath}${link.href}`}
              key={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          className="btn btn-primary mobile-panel-cta"
          href="tel:+2348152404200"
          onClick={() => setOpen(false)}
        >
          <Phone size={17} /> {callLabel} <ArrowUpRight size={17} />
        </a>
      </div>
    </>
  );
}
