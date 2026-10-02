import { useState } from 'react';
import type { VenturePlan } from '../types';

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
    tag: 'Done',
    title: 'Product strategy sprint',
    body: 'Labor Day week — Tuesday September 8 through Friday September 11. Pricing moved to a percentage of personal-lines premium. Seven surfaces sit above the line for November 6. The business intelligence dashboard was cut to an email.',
    href: '#/sprint',
    cta: 'What we decided',
  },
  {
    tag: 'Now',
    title: 'Stockton Hill pilot',
    body: 'Kickoff Friday September 18, three weeks to October 9. Format is Review Fridays — one shopped household at a time, individual sessions rather than a group. Version A outreach, so we can compare a second agency against Members 1st. Runs alongside the MVP build.',
    href: '#/poc',
    cta: 'View POC details',
  },
  {
    tag: 'Now',
    title: 'MVP build',
    body: 'Dev started September 14 — six weeks of build, then two weeks of QA. Feature freeze Friday October 23. The first three weeks overlap Stockton Hill so they can react to wireframes while design is still cheap to change.',
    href: '#/mvp',
    cta: 'View MVP details',
  },
  {
    tag: 'Then',
    title: 'MVP launch',
    body: 'November 6. One paying agency live, running their real renewal week on the software. A named design partner follows Stockton Hill in October and doubles as the QA population.',
    href: '#/mvp',
    cta: 'View MVP details',
  },
];

export function RoadmapPage({
  plan,
  exportMarkdown,
  hasLocalEdits,
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
          The path from today&rsquo;s pilot to a first paying customer on November 6 — what each
          milestone is and what we aim to learn. The live Gantt is its own page.
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
      </section>

      {plan ? (
        <>
          {hasLocalEdits ? (
            <p className="local-edits-banner">
              You have unsaved browser edits to the plan. Download JSON and ask the agent to commit,
              or reset to the deployed version.
            </p>
          ) : null}

          <section className="card phase-card gantt-teaser">
            <div className="section-head">
              <div>
                <h2>Current plan</h2>
                <p className="export-hint">
                  Day, week, month, quarter, and year. Filter by person or workstream. Full screen
                  on its own page.
                </p>
              </div>
              <a className="copy-btn" href="#/gantt">
                Open Gantt chart →
              </a>
            </div>
          </section>

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
