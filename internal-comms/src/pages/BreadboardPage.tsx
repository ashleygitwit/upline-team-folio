const AGENT_SCREENS: { n: string; name: string; note?: string; items: string[] }[] = [
  {
    n: '1',
    name: 'Business Intelligence',
    note: 'Killed for MVP — ships as an email, first screen back after launch.',
    items: [
      'What you need me to do: policies to bind, new leads, outreach / rec ready',
      'What you’ve been doing: policyholder touches, cross-sells',
      'Click through to outreach',
    ],
  },
  {
    n: '2',
    name: 'Renewal Queue',
    items: [
      'Client list grouped by state: ready to reach out, recommendation ready, shopping',
      'Click a client name',
    ],
  },
  {
    n: '3',
    name: 'Outreach Review',
    note: 'Not a client profile. The email review, with client context on it.',
    items: [
      'Client details, household, current policy, renewal $',
      'Edit the outreach email',
      'Send from the agent’s own inbox',
    ],
  },
  {
    n: '4',
    name: 'Shopping Results',
    note: 'A magic moment. Three carriers, plus talking points.',
    items: [
      'Side-by-side: price and coverage',
      'What’s different?',
      'Upline rec, then generate the email',
    ],
  },
  {
    n: '5',
    name: 'Recommendation',
    items: [
      'View the Upline draft',
      'Modify what the insured sees',
      'Send the email',
    ],
  },
];

const INSURED_SCREENS: { n: string; name: string; items: string[] }[] = [
  {
    n: '1',
    name: 'Email from my agent',
    items: ['Welcome, update / rec to shop, questionnaire link', 'Click the link'],
  },
  {
    n: '2',
    name: 'Questionnaire',
    items: [
      'Verify pre-filled info',
      'Cross-sell and referral ask live here, before shopping',
      'Submit when done',
    ],
  },
  {
    n: '3',
    name: 'Email from my agent — the rec',
    items: ['Recommendation, a brief explanation of the work, link to the visual', 'Click the link'],
  },
  {
    n: '4',
    name: 'Proposal page',
    items: ['Shopped carrier breakdowns, price, coverage', 'Click to approve'],
  },
];

export function BreadboardPage() {
  return (
    <div className="breadboard-page">
      <a className="page-back" href="#/sprint">
        &larr; Back to strategy sprint
      </a>

      <section className="hero">
        <p className="eyebrow">Progress</p>
        <h1 className="hero-title">Product breadboard.</h1>
        <p className="hero-sub">
          Thursday September 10 — Upline screens, sans design. Places, affordances, connections.
          The board starts after the agency is live. Off-board: VAs shop three carriers per
          household.
        </p>
      </section>

      <p className="breadboard-question">
        What would make an agent stop? What do they want to have their fingerprints on?
      </p>

      <section className="card phase-card">
        <h2>Agent lane</h2>
        <div className="breadboard-grid">
          {AGENT_SCREENS.map((screen) => (
            <article key={screen.name} className="breadboard-screen">
              <p className="breadboard-n">{screen.n}</p>
              <h3>{screen.name}</h3>
              {screen.note ? <p className="breadboard-note">{screen.note}</p> : null}
              <ul>
                {screen.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="card phase-card">
        <h2>Policyholder lane</h2>
        <div className="breadboard-grid">
          {INSURED_SCREENS.map((screen) => (
            <article key={screen.name} className="breadboard-screen">
              <p className="breadboard-n">{screen.n}</p>
              <h3>{screen.name}</h3>
              <ul>
                {screen.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
