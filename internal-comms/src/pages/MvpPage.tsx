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
  items: string[];
}

const KANBAN_COLS: KanbanCol[] = [
  {
    title: 'Above the line — Nov 6',
    color: 'var(--success-strong)',
    text: 'var(--primary-foreground)',
    items: [
      'Renewal queue',
      'Outreach review and send',
      'Household questionnaire',
      'VA shopping of three carriers',
      'Shop results for the agent',
      'The proposal the policyholder sees',
      'Needs-binding state that cannot silently disappear',
    ],
  },
  {
    title: 'Cut — first thing back after',
    color: 'var(--chart-3)',
    text: 'var(--foreground)',
    items: [
      'BI dashboard as a screen (stats ship as an email)',
      'Native mobile app',
      'Ask Upline anything chat',
      'SMS and omnichannel — email only',
      'Auto-shop, binding and payment inside Upline',
      'Writing structured data back into the AMS',
    ],
  },
];

export function MvpPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Progress</p>
        <h1 className="hero-title">MVP definition.</h1>
        <p className="hero-sub">
          Dev started September 14. Six build weeks, then two QA weeks, ship Friday November 6.
          Feature freeze October 23 — no new surfaces after that, bugs only. Some steps stay
          manual at launch (VAs shopping). The first three weeks overlap Stockton Hill so they
          can react to wireframes while design is still cheap to change.
        </p>
      </section>

      <section className="card phase-card">
        <h2>Launch date</h2>
        <p className="proof-statement">Friday November 6.</p>
        <ul className="strat-list">
          <li>
            <strong>Design done Friday Oct 2</strong> — Stockton Hill has been reacting to
            wireframes while change is still cheap.
          </li>
          <li>
            <strong>Feature freeze Friday Oct 23</strong> — no new surfaces after that, bugs only.
            Exit test: 30 real households, timed.
          </li>
          <li>
            <strong>Ship Friday Nov 6</strong> — one paying agency running a real renewal week on
            the seven surfaces above the line.
          </li>
        </ul>
      </section>

      <section className="card phase-card">
        <h2>Weekly meetings</h2>
        <p className="export-hint" style={{ marginTop: 0 }}>
          Monday How Should We is retired. This team runs the weekly from here.
        </p>
        <ul className="strat-list">
          <li>
            <strong>Company weekly — Tuesday.</strong> First one is Thursday Sep 17, to tear up
            the OKR draft. After that it is the Tuesday all-hands; product and go-to-market can
            split into their own tracks from there.
          </li>
          <li>
            <strong>Product stand-ups — Tuesday and Thursday mornings.</strong> Monday and
            Wednesday stay the meeting-heavy days. Linear carries the ticket detail.
          </li>
          <li>
            <strong>Monthly report-out</strong> uses the OKR format. That is the board cadence,
            not a second set of goals.
          </li>
        </ul>
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
          Thursday keep-kill set the line. Working product journey of the first sellable week lives
          on the <a href="#/mvp-journey">layered MVP journey map</a> — experience, data, and
          features on the same grid.
        </p>
        <h3 className="sub-label">The November 6 cut</h3>
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
                <ul className="kanban-list">
                  {col.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
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
          <p className="empty-state-t">Build is in flight — outcome still TBD</p>
          <p className="empty-state-b">
            Dev started Sep 14. The outcome we&rsquo;re after: a first paying customer live on
            the product Friday November 6, running their real renewal week on the seven surfaces
            above the line.
          </p>
        </div>
      </section>
    </>
  );
}
