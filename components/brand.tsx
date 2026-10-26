export default function Brand({ light = false, href = "/" }: { light?: boolean; href?: string }) {
  return <a href={href} aria-label="Supreme Computer home" className={`brand ${light ? "brand-light" : ""}`}>
    <span className="brand-symbol" aria-hidden="true"><span/><span/><span/></span>
    <span className="brand-name">SUPREME <strong>COMPUTER</strong></span>
  </a>;
}
