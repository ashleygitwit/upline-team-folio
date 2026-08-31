import { useEffect, useRef } from 'react';
import type { VenturePlan } from '../types';

interface HomePageProps {
  plan: VenturePlan | null;
}

// The embedded journey page is same-origin, so we can size the frame to its
// content and let the page scroll instead of the iframe. Its lanes expand and
// collapse on click, so the height is kept in sync as the content reflows.
function useContentHeight() {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;

    let observer: ResizeObserver | undefined;

    // Before the lazy load fires the frame holds about:blank; measuring that
    // would collapse it to nothing and strand it below the viewport.
    const loadedDoc = () => {
      const doc = frame.contentDocument;
      return doc && doc.location.href !== 'about:blank' ? doc : null;
    };

    const sync = () => {
      const doc = loadedDoc();
      if (!doc?.body) return;
      // Measure the body, not documentElement: the latter is clamped to the
      // iframe's own viewport, so the frame could only ever grow.
      const height = Math.ceil(doc.body.getBoundingClientRect().height);
      // Guard against a measure/apply feedback loop on sub-pixel differences.
      if (height && Math.abs(frame.clientHeight - height) > 1) {
        frame.style.height = `${height}px`;
      }
    };

    const attach = () => {
      const doc = loadedDoc();
      if (!doc?.body) return;
      sync();
      observer?.disconnect();
      observer = new ResizeObserver(sync);
      observer.observe(doc.body);
    };

    frame.addEventListener('load', attach);
    if (frame.contentDocument?.readyState === 'complete') attach();
    window.addEventListener('resize', sync);

    return () => {
      frame.removeEventListener('load', attach);
      window.removeEventListener('resize', sync);
      observer?.disconnect();
    };
  }, []);

  return ref;
}

interface ArcStep {
  beat: string;
  heading: string;
  text: string;
  href?: string;
  cta?: string;
  external?: boolean;
}

const ARC: ArcStep[] = [
  {
    beat: 'The insight that started it all',
    heading:
      'A renewal is an agent\u2019s best chance to reconnect with a client \u2014 to shop for a better rate, add coverage, and open cross-sell and up-sell conversations.',
    text: 'But books are too big to reach everyone in time, so clients quietly churn (often 8\u20139%) when a renewal lands, especially with an increase. The unlock: catch every renewal, and be able to offer to shop every single one.',
    href: 'https://upline-members1st-investor-demo.netlify.app/',
    cta: 'The original concept demo',
    external: true,
  },
  {
    beat: 'What we\u2019ve learned',
    heading:
      'Members 1st proved it: short outreach in the agency\u2019s voice, shop the big jumps first, keep the phone close in-house.',
    text: '43% of emailed households completed a questionnaire; seven switched carriers. Without the product they go reactive again \u2014 so the win is making proactive renewal work actually feasible, not just desirable.',
    href: '#/learnings',
    cta: 'Read the learnings',
  },
];

export function HomePage({ plan }: HomePageProps) {
  const journeyFrame = useContentHeight();

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

      <div className="feature-band">
        <div className="feature-band-inner">
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
                    <h3 className="arc-heading">{step.heading}</h3>
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
                ref={journeyFrame}
                title="Upline — the product journey"
                src="/product-journey.html?v=7"
                loading="lazy"
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
