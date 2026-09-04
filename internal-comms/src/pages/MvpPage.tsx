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
  { title: 'Feature backlog', color: 'var(--primary)', text: 'var(--primary-foreground)', placeholder: true },
  { title: 'MVP scope', color: 'var(--success-strong)', text: 'var(--primary-foreground)' },
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
          The first sellable front-end experience (Sep 14 through Nov 6), even if some steps stay
          manual — VAs shopping — at launch. Starts the week after the Labor Day sprint (Sep
          8–11). The first three weeks overlap the Stockton Hill pilot.
        </p>
      </section>

      {/* GOAL */}
      <section className="card phase-card">
        <h2>Goal</h2>
        <p className="proof-statement">
          Ship the first sellable front-end experience the agent actually touches — review and send
          — with some steps still manual (VAs shopping) behind the scenes at launch. The target is a
          first paying customer around Nov 6.
        </p>
      </section>

      {/* SCOPE */}
      <section className="card phase-card">
        <h2>Scope</h2>
        <p className="export-hint" style={{ marginTop: 0 }}>
          Working preliminary product journey map of the first sellable week lives on the{' '}
          <a href="#/mvp-journey">layered MVP journey map</a> — experience, data, and
          features on the same grid. Feature cards below stay until that map is locked.
        </p>
        <h3 className="sub-label">Feature backlog</h3>
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
      <section className="card phase-card">
        <h2>Outcome</h2>
        <div className="empty-state is-tall">
          <p className="empty-state-t">Build hasn&rsquo;t started yet — outcome TBD</p>
          <p className="empty-state-b">
            The MVP build starts Sep 14, the week after Labor Day sprint, alongside Stockton Hill.
            The outcome we&rsquo;re after:
            a first commercial customer live on the product around Nov 6.
          </p>
        </div>
      </section>
    </>
  );
}
