"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";

/**
 * Keeps one understated transition layer mounted between App Router pages.
 * In-page anchors, downloads, external links, and modifier-key navigation
 * always retain native browser behavior.
 */
export default function PageTransitions({ copy = {} }: { copy?: Record<string, string> }) {
  const t = (key: string, fallback: string) => copy[`transition.${key}`] || fallback;
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const navigatingRef = useRef(false);
  const mountedRef = useRef(false);
  const recoveryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    if (!navigatingRef.current || !overlayRef.current) return;
    const overlay = overlayRef.current;
    if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);

    // Let the new document paint behind the covering sheet first.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.to(overlay, {
          yPercent: -100,
          duration: 0.54,
          ease: "power3.inOut",
          onComplete: () => {
            gsap.set(overlay, { yPercent: 100 });
            overlay.style.pointerEvents = "none";
            navigatingRef.current = false;
          },
        });
      });
    });
  }, [pathname]);

  useEffect(() => {
    const canAnimate = () => !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey
      ) return;

      const element = event.target;
      if (!(element instanceof Element)) return;
      const link = element.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;

      const next = new URL(link.href, window.location.href);
      if (
        next.origin !== window.location.origin ||
        (next.pathname === window.location.pathname && next.search === window.location.search)
      ) return;

      // Do not hijack links to another host or the browser's special protocols.
      if (!next.protocol.startsWith("http") || !canAnimate()) return;
      event.preventDefault();
      if (navigatingRef.current || !overlayRef.current) return;

      navigatingRef.current = true;
      const overlay = overlayRef.current;
      gsap.killTweensOf(overlay);
      gsap.set(overlay, { yPercent: 100 });
      overlay.style.pointerEvents = "auto";

      gsap.to(overlay, {
        yPercent: 0,
        duration: 0.48,
        ease: "power3.inOut",
        onComplete: () => router.push(next.pathname + next.search + next.hash),
      });

      // A network or route error must never trap the visitor beneath the layer.
      if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);
      recoveryTimerRef.current = setTimeout(() => {
        gsap.to(overlay, {
          yPercent: -100,
          duration: 0.35,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(overlay, { yPercent: 100 });
            overlay.style.pointerEvents = "none";
            navigatingRef.current = false;
          },
        });
      }, 8000);
    };

    const handlePrefetch = (event: MouseEvent | FocusEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
        router.prefetch(url.pathname);
      }
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("mouseover", handlePrefetch, { passive: true });
    document.addEventListener("focusin", handlePrefetch);
    document.addEventListener("touchstart", handlePrefetch, { passive: true });

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("mouseover", handlePrefetch);
      document.removeEventListener("focusin", handlePrefetch);
      document.removeEventListener("touchstart", handlePrefetch);
      if (recoveryTimerRef.current) clearTimeout(recoveryTimerRef.current);
    };
  }, [router]);

  return (
    <div ref={overlayRef} className="page-transition" aria-hidden="true">
      <div className="page-transition-wordmark">
        <span className="page-transition-mark">✳</span>
        <span>{t("wordmark", "SUPREME COMPUTER")}</span>
      </div>
      <div className="page-transition-caption">
        <span>{t("caption_1", "PRINTING / DIGITAL SERVICES")}</span>
        <span>{t("caption_2", "BENIN CITY, NIGERIA")}</span>
      </div>
    </div>
  );
}
