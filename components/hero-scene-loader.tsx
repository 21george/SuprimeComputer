"use client";

import { lazy, Suspense, useEffect, useState } from "react";

const LazyScene = lazy(() => import("./hero-scene"));

export default function HeroSceneLoader() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 600px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (mobile || reduced) return;
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || probe.getContext("webgl", { failIfMajorPerformanceCaveat: true });
      if (context) {
        context.getExtension("WEBGL_lose_context")?.loseContext();
        setEnabled(true);
      }
    } catch { /* The CSS illustration remains visible. */ }
  }, []);
  if (!enabled) return null;
  return <Suspense fallback={null}><LazyScene/></Suspense>;
}
