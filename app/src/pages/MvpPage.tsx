const COST_ASSUMPTIONS: [string, string][] = [
  ['1,500', 'households'],
  ['~30', 'outreach / week'],
  ['~25%', 'respond'],
  ['~29%', 'of those reached opt to shop (25–33%)'],
  ['30–45 min', 'to shop each'],
  ['~6', 'closes / week'],
  ['$8/hr', 'VA (fully loaded)'],
  ['VA', 'shopping + biweekly data refresh'],
  ['RPA', 'initial load + renewal pulls'],
];

interface CostRow {
  group?: string;
  item?: string;
  basis?: string;
  amt?: string;
  note?: string;
  total?: boolean;
}

const COST_ROWS: CostRow[] = [
  { group: 'Labor' },
  { item: 'Shopping (VA)', basis: '~8–9/wk × ~38 min @ $8/hr', amt: '~$190' },
  {
    item: 'Household-data refresh (VA)',
    basis: '~30/wk entering window × ~4 min @ $8/hr',
    amt: '~$65',
    note: '→ ~$0 if the RPA does this instead',
  },
  {
    item: 'Close meetings',
    basis: "agency servicing team takes these — they're paid on the close",
    amt: '$0',
  },
  { group: 'Automation & tools' },
  {
    item: 'RPA — initial load + weekly renewal pulls',
    basis: 'built in-house (Stagehand + Browserbase): browser-hosting plan + LLM tokens',
    amt: '~$20–100',
  },
  {
    item: 'Email — send + reply capture (Graph / Gmail API)',
    basis: "through the agent's own mailbox",
    amt: 'Free',
  },
  {
    item: 'Meeting transcription (Recall.ai + AssemblyAI)',
    basis: '~$0.80/hr × meeting hrs',
    amt: '~$16',
  },
  {
    item: 'Phone recording + transcription (Twilio)',
    basis: '~$0.0025/min + number',
    amt: '~$10',
  },
  { item: 'Two-way text capture (Twilio SMS)', basis: 'number + ~$0.008/msg', amt: '~$10' },
  { item: 'Scheduling (Calendly)', basis: 'per seat', amt: '~$12' },
  { item: 'E-signature (Dropbox Sign / PandaDoc)', basis: 'unlimited plan', amt: '~$25' },
  { total: true, item: 'Recurring total', basis: 'per agency / month', amt: '~$350–430' },
];

const DOMAINS = [
  {
    title: 'Client details',
    items: [
      'Contacts — email, phone, DOB',
      'Policy list + LOB status',
      'Current declaration pages',
      'Multi-year policy & premium history',
      'Latest renewal premium + % change (RPA-pulled)',
      'Current carrier per household',
      'Claims history',
      'Coverage gaps & household facts',
      'Cross-sell interest (life / Medicare-Medicaid / commercial)',
    ],
  },
  {
    title: 'Communications',
    items: [
      'Outreach emails — frame sent + delivery',
      'Inbound replies — content',
      'Questionnaire submissions — answers',
      'Calls & meetings — recordings, transcripts, intelligence',
      'Texts — two-way messages',
    ],
  },
  {
    title: 'Past outreach logic',
    items: [
      'Which email frame was sent, and when',
      'Weekly cadence position + number of touches',
      'Follow-ups / re-entries',
      'Cross-sell offers made',
    ],
  },
  {
    title: 'Responses & sentiment',
    items: [
      'Response rate',
      'Response type (opened, replied, questionnaire, booked, showed)',
      'Sentiment (positive / neutral / negative)',
      'Outcome (shopped, switched, retained, cross-sold)',
    ],
  },
];

interface KanbanCol {
  title: string;
  color: string;
  text: string;
  placeholder?: boolean;
}

const KANBAN_COLS: KanbanCol[] = [
  { title: 'Feature backlog', color: 'var(--primary)', text: '#fff', placeholder: true },
  { title: 'MVP scope', color: 'var(--chart-5)', text: '#fff' },
  { title: 'Future features', color: 'var(--chart-3)', text: 'var(--foreground)' },
];

export function MvpPage() {
  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · Then</p>
        <h1 className="hero-title">MVP build.</h1>
        <p className="hero-sub">
          A ~10-week build of the first sellable front-end experience (roughly mid-September through
          mid-November), even if some steps stay manual — VAs shopping — at launch.
        </p>
      </section>

      {/* GOAL */}
      <div className="phase-rule">
        <span>Goal</span>
      </div>
      <section className="card phase-card">
        <p className="proof-statement">
          Ship the first sellable front-end experience the agent actually touches — review and send
          — with some steps still manual (VAs shopping) behind the scenes at launch. The target is a
          first paying customer around mid-November.
        </p>
      </section>

      {/* SCOPE */}
      <div className="phase-rule">
        <span>Scope</span>
      </div>
      <section className="card phase-card">
        <p className="sub-label">Feature backlog</p>
        <div className="kanban">
          {KANBAN_COLS.map((col) => (
            <div key={col.title} className="kanban-col">
              <div className="kanban-col-head" style={{ background: col.color, color: col.text }}>
                {col.title}
              </div>
              <div
                className="kanban-col-body"
                style={{ background: `color-mix(in srgb, ${col.color} 6%, var(--card))` }}
              >
                {col.placeholder ? (
                  <div className="kanban-card-ph">
                    Feature placeholder — features will be listed here.
                  </div>
                ) : (
                  <span className="kanban-empty">Empty for now</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <hr className="soft-rule" />

        <details className="accordion">
          <summary>
            Cost breakdown — what it costs to run the MVP
            <span className="accordion-caret" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="accordion-body">
            <p className="export-hint">
              Estimated monthly run-cost for one ~1,500-household agency. Excludes MVP build /
              engineering — this is ongoing time + tool cost only. VA labor is{' '}
              <strong>shopping</strong> plus a light <strong>biweekly data-refresh</strong> pull; the
              RPA handles the initial load and the weekly renewal-number pulls. Directional; edit the
              assumptions with Austin.
            </p>
            <div className="cost-assumptions">
              {COST_ASSUMPTIONS.map(([v, l]) => (
                <span key={l} className="cost-pill">
                  <b>{v}</b> {l}
                </span>
              ))}
            </div>
            <div className="cost-table-wrap">
              <table className="cost-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Basis</th>
                    <th className="amt">Est. $/mo</th>
                  </tr>
                </thead>
                <tbody>
                  {COST_ROWS.map((r, i) =>
                    r.group ? (
                      <tr key={`g-${i}`} className="cost-group">
                        <td colSpan={3}>{r.group}</td>
                      </tr>
                    ) : (
                      <tr key={r.item} className={r.total ? 'cost-total' : undefined}>
                        <td>
                          {r.item}
                          {r.note ? <span className="cost-row-note"> {r.note}</span> : null}
                        </td>
                        <td className="cost-basis">{r.basis}</td>
                        <td className="amt">{r.amt}</td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
            <div className="mini-callout">
              <p className="mini-callout-t">What this means</p>
              <p>
                Recurring human labor is <strong>VA shopping (~$190/mo)</strong> plus a light{' '}
                <strong>pre-outreach data refresh (~$65/mo)</strong>. The RPA handles the initial
                load and weekly renewal-number pulls, and the expensive close is{' '}
                <strong>$0 to Upline</strong> (the servicing team&rsquo;s revenue). Building the RPA
                on Stagehand + Browserbase runs <strong>~$20–100/mo</strong> — vs.{' '}
                <strong>$8k–15k per bot per year</strong> for a commercial RPA platform, so building
                is ~10–50× cheaper. Whole thing runs <strong>~$350–430/mo per agency</strong>.
              </p>
            </div>
          </div>
        </details>

        <details className="accordion">
          <summary>
            Data repository — data collected in the MVP and stored in the Upline repository
            <span className="accordion-caret" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="accordion-body">
            <p className="export-hint">
              Everything that lives here by the end of the journey. Not framed as an AMS replacement
              now; over 12–24 months it becomes more current than the agency&rsquo;s AMS. May land
              beyond the MVP — scope TBD.
            </p>
            <div className="repo-breadcrumb">
              <span className="repo-chip">
                <b>Book of business</b> <span className="repo-chip-s">every household</span>
              </span>
              <span className="repo-arrow">&rarr;</span>
              <span className="repo-chip">
                <b>Client / household profile</b>{' '}
                <span className="repo-chip-s">× every client</span>
              </span>
              <span className="repo-arrow">&rarr;</span>
              <span className="repo-chip-label">each profile holds:</span>
            </div>
            <div className="repo-domains">
              {DOMAINS.map((d) => (
                <div key={d.title} className="repo-domain">
                  <h3>{d.title}</h3>
                  <ul>
                    {d.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </details>
      </section>

      {/* OUTCOME */}
      <div className="phase-rule">
        <span>Outcome</span>
      </div>
      <section className="card phase-card">
        <div className="empty-state is-tall">
          <p className="empty-state-t">Build hasn&rsquo;t started yet — outcome TBD</p>
          <p className="empty-state-b">
            The MVP build kicks off in mid-September. The outcome we&rsquo;re after: a first
            commercial customer live on the product around mid-November.
          </p>
        </div>
      </section>
    </>
  );
}
