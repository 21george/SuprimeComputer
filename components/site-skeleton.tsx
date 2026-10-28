/** Shared route-loading placeholder for the Supabase-backed homepage and service pages. */
function Bar({ className = "" }: { className?: string }) {
  return <span className={`site-skeleton-bar ${className}`} aria-hidden="true" />;
}

function Header() {
  return <>
    <div className="site-skeleton-top" aria-hidden="true" />
    <header className="site-skeleton-header">
      <div className="container site-skeleton-header-inner">
        <div className="site-skeleton-brand"><span className="site-skeleton-brand-mark" /><div><Bar className="site-skeleton-logo-main"/><Bar className="site-skeleton-logo-sub"/></div></div>
        <div className="site-skeleton-nav"><Bar/><Bar/><Bar/></div>
        <Bar className="site-skeleton-header-cta"/>
      </div>
    </header>
  </>;
}

function HomeSkeleton() {
  return <>
    <section className="site-skeleton-hero">
      <div className="container site-skeleton-hero-inner">
        <div className="site-skeleton-hero-copy">
          <Bar className="site-skeleton-eyebrow"/>
          <Bar className="site-skeleton-title"/>
          <Bar className="site-skeleton-title short"/>
          <Bar className="site-skeleton-description"/>
          <Bar className="site-skeleton-description mid"/>
          <Bar className="site-skeleton-button"/>
        </div>
        <div className="site-skeleton-hero-art" aria-hidden="true"><div className="site-skeleton-art-orbit"/><div className="site-skeleton-art-shape"/><div className="site-skeleton-art-paper"/></div>
      </div>
    </section>
    <section className="container site-skeleton-services">
      <Bar className="site-skeleton-section-eyebrow"/>
      <Bar className="site-skeleton-section-title"/>
      <div className="site-skeleton-service-grid">{Array.from({ length: 4 }).map((_, index) =>
        <div className="site-skeleton-service" key={index}>
          <Bar className="site-skeleton-icon"/>
          <Bar className="site-skeleton-card-title"/>
          <Bar className="site-skeleton-card-text"/>
          <Bar className="site-skeleton-card-text short"/>
          <Bar className="site-skeleton-card-link"/>
        </div>
      )}</div>
    </section>
  </>;
}

function DetailSkeleton() {
  return <>
    <section className="site-skeleton-detail-hero">
      <div className="container">
        <Bar className="site-skeleton-breadcrumb"/>
        <div className="site-skeleton-detail-layout">
          <div className="site-skeleton-detail-copy">
            <Bar className="site-skeleton-eyebrow"/>
            <Bar className="site-skeleton-title"/>
            <Bar className="site-skeleton-title short"/>
            <Bar className="site-skeleton-description"/>
            <Bar className="site-skeleton-description mid"/>
            <Bar className="site-skeleton-button"/>
          </div>
          <div className="site-skeleton-detail-art" aria-hidden="true"><div className="site-skeleton-art-orbit"/><div className="site-skeleton-art-shape"/></div>
        </div>
      </div>
    </section>
    <section className="container site-skeleton-detail-body">
      <div><Bar className="site-skeleton-section-eyebrow"/><Bar className="site-skeleton-section-title"/><Bar className="site-skeleton-card-text"/><Bar className="site-skeleton-card-text short"/></div>
      <div className="site-skeleton-detail-list">{Array.from({ length: 3 }).map((_, index) =>
        <div key={index}><Bar className="site-skeleton-card-title"/><Bar className="site-skeleton-card-text"/></div>
      )}</div>
    </section>
  </>;
}

export default function SiteSkeleton({ page = "home" }: { page?: "home" | "detail" }) {
  return <div className="site-skeleton-page" role="status" aria-live="polite" aria-busy="true" aria-label="Loading Supreme Computer page">
    <span className="sr-only">Loading Supreme Computer content…</span>
    <Header/>
    {page === "detail" ? <DetailSkeleton/> : <HomeSkeleton/>}
  </div>;
}
