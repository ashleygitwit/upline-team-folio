const DESIGN_HUB_URL = 'https://upline-design-hub.vercel.app/';

export function BrandPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Brand</p>
        <h1 className="hero-title">The Upline Design Hub</h1>
        <p className="hero-sub">
          Reference the Upline design hub to create any and all branded assets for Upline. The hub
          includes guidance for web pages, slide decks, social assets, ads, emails and product ui.
          Don&rsquo;t see a page for what you&rsquo;re working on? Just point your LLM to the design
          hub brand guide page and it will apply the Upline brand colors, fonts, and logo.
        </p>
      </section>

      <section className="hub-card">
        <div className="hub-card-head">
          <h2>The Upline Design Hub</h2>
          <a className="hub-cta" href={DESIGN_HUB_URL} target="_blank" rel="noreferrer">
            Visit the Design Hub
          </a>
        </div>
        {/* Same destination as the button, so it stays out of the tab order and
            the accessibility tree rather than announcing the link twice. */}
        <a
          className="hub-card-shot"
          href={DESIGN_HUB_URL}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden="true"
        >
          <img src="/brand/design-hub-hero.jpg" alt="" width={1856} height={1160} />
        </a>
      </section>
    </>
  );
}
