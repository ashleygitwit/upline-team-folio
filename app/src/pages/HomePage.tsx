import type { VenturePlan } from '../types';
import { SwimlaneMap, type SwimLane, type SwimStep, type SwimPhase } from '../components/SwimlaneMap';

interface HomePageProps {
  plan: VenturePlan | null;
}

// "At a glance" version of the full product journey — the actors and the
// left-to-right flow, minus the deep detail in the embedded version below.
const JOURNEY_LANES: SwimLane[] = [
  { key: 'upline', label: 'Upline', color: 'var(--primary)' },
  { key: 'va', label: 'VA', color: 'oklch(0.62 0.14 40)' },
  { key: 'agent', label: 'Agent', color: 'var(--chart-5)' },
  { key: 'customer', label: 'Customer', color: 'oklch(0.55 0.12 262)' },
];

const JOURNEY_STEPS: SwimStep[] = [
  { lane: 0, text: 'Pull the book + renewals (RPA)' },
  { lane: 1, text: 'Refresh household data before outreach' },
  { lane: 0, text: 'Generate the outreach email' },
  { lane: 2, text: 'Send it — from the agent\u2019s own name' },
  { lane: 3, text: 'Complete the tailored questionnaire' },
  { lane: 1, text: 'Shop across multiple carriers' },
  { lane: 0, text: 'Draft the recommendation' },
  { lane: 2, text: 'Review, adjust, and send' },
  { lane: 3, text: 'Schedule, meet, and decide' },
];

const JOURNEY_PHASES: SwimPhase[] = [
  { start: 0, span: 2, label: 'Set up the data', bg: 'var(--primary)', fg: '#fff' },
  { start: 2, span: 3, label: 'Reach out & intake', bg: 'var(--chart-3)', fg: '#3a3320' },
  { start: 5, span: 2, label: 'Shop & recommend', bg: 'var(--chart-5)', fg: '#fff' },
  { start: 7, span: 2, label: 'Review & close', bg: 'oklch(0.55 0.12 262)', fg: '#fff' },
];

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
        <div className="journey-glance">
          <h2>Upline Journey — at a glance</h2>
          <p className="arc-intro">
            The whole flow in one view — who does what, left to right. Want the detail? The full
            version is right below.
          </p>
          <SwimlaneMap
            lanes={JOURNEY_LANES}
            steps={JOURNEY_STEPS}
            phases={JOURNEY_PHASES}
            ariaLabel="Upline product journey at a glance. Upline pulls the book and renewal numbers by RPA; a VA refreshes household data; Upline generates the outreach email; the agent sends it from their own name; the customer completes a tailored questionnaire; a VA shops across carriers; Upline drafts the recommendation and cross-sell; the agent reviews, adjusts, and sends; the customer schedules, meets, and decides."
          />
        </div>

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
