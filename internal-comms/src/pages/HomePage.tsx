import type { VenturePlan } from '../types';
import { PricingStrategy } from '../components/PricingStrategy';
import { ProductJourneyEmbed } from '../components/ProductJourneyEmbed';

interface HomePageProps {
  plan: VenturePlan | null;
}

const INSIGHT = {
  beat: 'The insight that started it all',
  heading:
    'A renewal is an agent\u2019s best chance to reconnect with a client \u2014 to shop for a better rate, add coverage, and open cross-sell and up-sell conversations.',
  text: 'But books are too big to reach everyone in time, so clients quietly churn (often 8\u20139%) when a renewal lands, especially with an increase. The unlock: catch every renewal, and be able to offer to shop every single one.',
  href: 'https://upline-members1st-investor-demo.netlify.app/',
  cta: 'The original concept demo',
};

export function HomePage({ plan }: HomePageProps) {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">What is Upline</p>
        <h1 className="hero-title">
          Upline turns every insurance renewal into a moment that proves the agent is in the
          customer&rsquo;s corner.
        </h1>
        <p className="hero-sub">
          A human-in-the-loop tool for independent P&amp;C agencies starting with renewals.
        </p>
        <p className="hero-sub">AI prepares the renewal. The agent owns the relationship.</p>
      </section>

      <div className="feature-band">
        <div className="feature-band-inner">
          <p className="band-kicker">{INSIGHT.beat}</p>
          <h2 className="band-lead">{INSIGHT.heading}</h2>
          <p className="band-copy">{INSIGHT.text}</p>
          <a className="arc-cta" href={INSIGHT.href} target="_blank" rel="noreferrer">
            {INSIGHT.cta} &rarr;
          </a>

          {plan ? (
            <div className="band-bet">
              <h2>Venture hypothesis</h2>
              <div className="bet-grid">
                <div className="bet-block bet-hypothesis">
                  <p>{plan.venture.hypothesis}</p>
                </div>
                <div className="bet-block bet-problem">
                  <p className="tile-label">Problem</p>
                  <p>{plan.venture.thesis.problem}</p>
                </div>
                <div className="bet-block bet-world">
                  <p className="tile-label">World after</p>
                  <p>{plan.venture.thesis.worldAfter}</p>
                </div>
                <div className="bet-block bet-approach">
                  <p className="tile-label">Our approach</p>
                  <p>{plan.venture.thesis.approach}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="loading">Loading venture context…</p>
          )}
        </div>
      </div>

      <section className="product-journey">
        <h2>Upline product journey</h2>
        <ProductJourneyEmbed view="simple" />
      </section>

      <PricingStrategy />
    </>
  );
}
