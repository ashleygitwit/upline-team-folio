interface DecisionBlock {
  title: string;
  items: string[];
}

const INPUTS = [
  'Two full pilots run end-to-end — Members 1st and Stockton Hill — across two very different agencies',
  'A validated outreach → questionnaire → shop → recommendation motion (and where it breaks)',
  'Real funnel and engagement data: response rates, opt-ins, and what actually drove a shop',
  'A clear read on which work is VA-assisted vs. automatable, and the cost to run it',
];

const DECISIONS: DecisionBlock[] = [
  {
    title: 'Product scope',
    items: [
      'What is in the first sellable experience — and what stays manual at launch',
      'Which surface the agent actually touches (review + send) vs. what runs behind the scenes',
      'The shortest path to a proposal an agent trusts enough to send',
    ],
  },
  {
    title: 'Data & architecture',
    items: [
      'Whether we can operate on a one-time AMS dump plus carrier portals (no ongoing integration)',
      'What the household data repository must hold to keep itself current',
      'Where RPA vs. VA sits in the shopping loop for year one',
    ],
  },
  {
    title: 'Business model',
    items: [
      'How we price when agencies control the copy and the cohort',
      'What a first paid engagement looks like and who signs it',
    ],
  },
];

export function SprintPage() {
  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · Next</p>
        <h1 className="hero-title">Product strategy sprint.</h1>
        <p className="hero-sub">
          An in-person sprint in late August (prep week Aug 24–28, sprint Aug 31–Sep 4). Because it
          follows two real pilots, it should be far better informed than a typical design sprint —
          we come in knowing which features work, the limits, and the logic. The output is a scoped
          MVP.
        </p>
      </section>

      {/* GOAL */}
      <div className="phase-rule">
        <span>Goal</span>
      </div>
      <section className="card phase-card">
        <p className="sub-label">What we bring in</p>
        <ul className="proving-list">
          {INPUTS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="proof-statement" style={{ marginTop: '1.4rem' }}>
          Turn everything two real pilots taught us into a scoped, buildable MVP — settled in one
          focused week.
        </p>
      </section>

      {/* PLAN */}
      <div className="phase-rule">
        <span>Plan</span>
      </div>
      <section className="card phase-card">
        <div className="empty-state">
          <p className="empty-state-t">The sprint plan isn&rsquo;t mapped yet</p>
          <p className="empty-state-b">
            We&rsquo;ll design the week (agenda, exercises, who&rsquo;s in the room) closer to late
            August, once both pilots have wrapped. Placeholder for now.
          </p>
        </div>
      </section>

      {/* OUTCOME */}
      <div className="phase-rule">
        <span>Outcome</span>
      </div>
      <section className="card phase-card">
        <p className="sub-label">The output of the week will include</p>
        <div className="decision-grid">
          {DECISIONS.map((d) => (
            <div key={d.title} className="decision-block">
              <h3>{d.title}</h3>
              <ul>
                {d.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
