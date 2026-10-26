import type { ReactNode } from "react";

export default function Eyebrow({ number, children, light = false }: { number: string; children: ReactNode; light?: boolean }) {
  return <p className={`eyebrow ${light ? "eyebrow-light" : ""}`}><span>{number}</span><i/>{children}</p>;
}
