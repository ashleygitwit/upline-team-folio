import type { VenturePlan } from '../types';

interface HomePageProps {
  plan: VenturePlan | null;
}

interface ArcStep {
  beat: string;
  text: string;
  href?: string;
  cta?: string;
  external?: boolean;
}

const ARC: ArcStep[] = [
  {
    beat: 'The insight that started it all',
    text: 'A renewal is an agent\u2019s best chance to reconnect with a client \u2014 to shop for a better rate, add coverage, and open cross-sell and up-sell conversations. But books are too big to reach everyone in time, so clients quietly churn (often 8\u20139%) when a renewal lands, especially with an increase. The unlock: catch every renewal, and be able to offer to shop every single one.',
    href: 'https://upline-members1st-investor-demo.netlify.app/',
    cta: 'The original concept demo',
    external: true,
  },
  {
    beat: 'What we\u2019ve learned',
    text: 'Just getting the right client in front of an agent at the right moment is already a big win. Doing the shopping is the biggest wow \u2014 but drafting the outreach and the recommendation strips out the grunt labor that makes \u201creach out on every renewal\u201d impossible today. We turn a nice-to-have into something actually feasible.',
    href: '#/learnings',
    cta: 'Read the learnings',
  },
];

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
          A human-in-the-loop tool for independent P&amp;C agencies, starting with renewals: triage
          who needs action, do the shopping legwork, and draft a clear recommendation the agent
          reviews and sends. AI prepares the renewal. The agent owns the relationship.
        </p>
      </section>

      <section className="arc-section">
        <h2>Venture Through Line</h2>
        <p className="arc-intro">
          From the insight that started it to what the pilot has taught us so far.
        </p>
        <div className="arc-grid">
          {ARC.map((step, i) => (
            <div key={step.beat} className="arc-cell">
              <div className="arc-step">
                <p className="arc-beat">{step.beat}</p>
                <p className="arc-text">{step.text}</p>
                {step.cta && step.href ? (
                  <a
                    className="arc-cta"
                    href={step.href}
                    {...(step.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                  >
                    {step.cta} &rarr;
                  </a>
                ) : null}
              </div>
              {i % 2 === 0 ? (
                <span className="arc-arrow" aria-hidden="true">
                  &rarr;
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      {plan ? (
        <section className="bento-section">
          <h2>The bet at a glance</h2>
          <div className="card bet-card">
            <div className="bet-grid">
              <div className="bet-block bet-hypothesis">
                <p className="tile-label">Venture hypothesis</p>
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
        </section>
      ) : (
        <p className="loading">Loading venture context…</p>
      )}

      <section className="product-journey">
        <div className="embed-frame embed-frame-tall">
          <iframe
            title="Upline — the product journey"
            src="/product-journey.html?v=4"
            loading="lazy"
          />
        </div>
        <a className="arc-link" href="/product-journey.html?v=4" target="_blank" rel="noreferrer">
          Open the product journey in a new tab &rarr;
        </a>
      </section>
    </>
  );
}
