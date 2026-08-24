import { useState } from 'react';
import type { VenturePlan } from '../types';
import { GanttSection } from '../components/GanttSection';
import { ScenarioGanttSection } from '../components/ScenarioGanttSection';

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
    body: 'Setup and holding ran Aug 5–24, waiting on their materials. Assumed kickoff Aug 26 for three weeks. Outreach resets to Version A so we can compare how copy and workflow evolve across two very different agencies.',
    href: '#/poc',
    cta: 'View POC details',
  },
  {
    tag: 'Then',
    title: 'Product strategy sprint',
    body: 'After Stockton wraps: one to two days of prep (Sep 17–18), a three-day in-person sprint (Sep 21–23), then two days of MVP planning (Sep 24–25). Because it follows two real pilots, it should be far better informed than a typical design sprint. Output: a scoped MVP.',
    href: '#/sprint',
    cta: 'View strategy sprint details',
  },
  {
    tag: 'Then',
    title: 'MVP build',
    body: 'A ~10-week build of the first sellable front-end experience, even if some steps stay manual (VAs shopping) at launch. Kickoff Sep 28. Target launch around Dec 4 / Thanksgiving.',
    href: '#/mvp',
    cta: 'View MVP details',
  },
  {
    tag: 'Then',
    title: 'MVP launch',
    body: 'The day the 10-week build lands. Current plan: Dec 4. If we start building next week, that date moves to Nov 6.',
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

          <ScenarioGanttSection compact />

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
