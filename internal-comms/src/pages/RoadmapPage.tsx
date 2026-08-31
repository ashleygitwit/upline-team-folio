import { useState } from 'react';
import type { VenturePlan } from '../types';
import { GanttSection } from '../components/GanttSection';

interface RoadmapPageProps {
  plan: VenturePlan | null;
  exportMarkdown: string;
  hasLocalEdits: boolean;
  onPlanChange: (plan: VenturePlan) => void;
  onDownload: () => void;
  onReset: () => void;
}

interface Milestone {
  tag: string;
  title: string;
  body: string;
  href?: string;
  cta?: string;
}

const MILESTONES: Milestone[] = [
  {
    tag: 'Done',
    title: 'Members 1st pilot',
    body: 'First live pilot wrapped (Jun 17 – Aug 3 retro). 42 emailed → 18 questionnaires (43%) → 18 recommendations → 7 switched, 5 stayed, 6 pending. Outreach and recommendation locked short; agency wants the product day-to-day once built.',
    href: '#/learnings',
    cta: 'Read the learnings',
  },
  {
    tag: 'Now',
    title: 'Stockton Hill pilot',
    body: 'Kicks off the week of Aug 31 for three weeks (through Sep 18). Outreach resets to Version A so we can compare how copy and workflow evolve across two very different agencies. Runs in tandem with sprint week and the start of the MVP build.',
    href: '#/poc',
    cta: 'View POC details',
  },
  {
    tag: 'Then',
    title: 'Product strategy sprint',
    body: 'Week of Sep 8. Four room days, Tuesday through Friday. Dual track with GTM. Thursday cuts features and stands up Linear. Friday morning is ops; Davey’s first experiment launches after lunch.',
    href: '#/sprint',
    cta: 'View strategy sprint details',
  },
  {
    tag: 'Then',
    title: 'MVP build',
    body: 'The first sellable front-end experience, even if some steps stay manual (VAs shopping) at launch. Starts coming out of sprint week (Sep 14). Target launch Nov 6.',
    href: '#/mvp',
    cta: 'View MVP details',
  },
  {
    tag: 'Then',
    title: 'MVP launch',
    body: 'November 6. Stockton Hill, the sprint, and the build run in tandem — we are not waiting for one to finish before the next starts.',
    href: '#/mvp',
    cta: 'View MVP details',
  },
];

export function RoadmapPage({
  plan,
  exportMarkdown,
  hasLocalEdits,
  onPlanChange,
  onDownload,
  onReset,
}: RoadmapPageProps) {
  const [copied, setCopied] = useState(false);

  // Temporarily hidden per request — flip to true to restore the "Copy for your LLM" export.
  const SHOW_LLM_EXPORT = false;

  async function copyExport() {
    await navigator.clipboard.writeText(exportMarkdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Roadmap</p>
        <h1 className="hero-title">Where we are, and where we&rsquo;re headed.</h1>
        <p className="hero-sub">
          The path from today&rsquo;s pilot to a first MVP — what each milestone is and what we aim
          to learn. The interactive timeline underneath is the live plan.
        </p>
      </section>

      <section className="roadmap-section">
        <h2>The path</h2>
        <ol className="milestone-rail">
          {MILESTONES.map((m) => (
            <li key={m.title} className="milestone">
              <span className="milestone-tag">{m.tag}</span>
              <div className="milestone-body">
                <h3>{m.title}</h3>
                <p>{m.body}</p>
                {m.href && m.cta ? (
                  <a className="milestone-cta" href={m.href}>
                    {m.cta} &rarr;
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="edit-hint">
          Path 2 (no AMS API) launch ops are in place — light CSV onboard, weekly renewal report,
          shortlist RPA, and Zapier write-back — while Path 1 AMS partner talks continue in
          parallel.
        </p>

        <a className="scale-cta" href="#/scale">
          <div>
            <p className="scale-cta-eyebrow">Looking past the MVP</p>
            <p className="scale-cta-title">Path to Scale — Oct ’26 → Q2 ’27</p>
            <p className="scale-cta-sub">
              Customer + VA ramp, VA-led vs auto-shopping priority, and what has to be true.
            </p>
          </div>
          <span className="scale-cta-arrow" aria-hidden="true">
            &rarr;
          </span>
        </a>
      </section>

      {plan ? (
        <>
          {hasLocalEdits ? (
            <p className="local-edits-banner">
              You have unsaved browser edits to the plan. Download JSON and ask the agent to commit,
              or reset to the deployed version.
            </p>
          ) : null}

          <GanttSection plan={plan} onPlanChange={onPlanChange} />

          {SHOW_LLM_EXPORT ? (
          <section className="card export-card">
            <div className="section-head">
              <div>
                <h2>Copy for your LLM</h2>
                <p className="export-hint">
                  Paste into ChatGPT, Claude, or your preferred chat tool to ask about timeline,
                  priorities, and what is in flight. Export is team-framed — no individual
                  assignments or meeting attributions.
                </p>
              </div>
              <div className="export-actions">
                <button type="button" className="secondary-btn" onClick={onDownload}>
                  Download plan JSON
                </button>
                {hasLocalEdits ? (
                  <button type="button" className="secondary-btn" onClick={onReset}>
                    Reset to deployed
                  </button>
                ) : null}
                <button type="button" className="copy-btn" onClick={copyExport}>
                  {copied ? 'Copied!' : 'Copy execution-plan.md'}
                </button>
              </div>
            </div>
            <pre className="export-box">{exportMarkdown}</pre>
          </section>
          ) : null}
        </>
      ) : (
        <p className="loading">Loading plan…</p>
      )}
    </>
  );
}
