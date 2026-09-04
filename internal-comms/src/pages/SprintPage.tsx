import { SPRINT_DAYS } from '../data/sprintDays';

const INPUTS = [
  'Members 1st run end-to-end — our only live pilot so far',
  'A drafted MVP experience and an early pricing approach treated as a constraint',
  'Real funnel and engagement data: response rates, opt-ins, and what actually drove a shop',
  'A clear read on which work is VA-assisted vs. automatable, and the cost to run it',
];

const ROLES = [
  { who: 'Justin — CEO', ask: 'Agent SME: how agents perceive value, what they’ll pay for, and how we sell this.' },
  { who: 'Davie — Founding Head of Sales', ask: 'VA hiring and management; go-to-market and sales strategy with Justin.' },
  { who: 'Claire — Brand and marketing', ask: 'Brand voice, marketing materials, and website.' },
  { who: 'Jacob — Business strategy', ask: 'Venture setup, structure, and how we make this a viable business.' },
  { who: 'Austin — Product strategist', ask: 'Technical feasibility, data, build approach, and product experience.' },
  { who: 'Ashley — Venture lead / facilitator', ask: 'Primary facilitator for the week; proof-of-concept, timelines, and venture-wide context.' },
  { who: 'Amanda — UX / UI', ask: 'Brand and user experience across the product.' },
  { who: 'Douglas — Engineering', ask: 'What to build, how to build it, and what’s realistic in the time we have.' },
  { who: 'Leander — GTM systems', ask: 'Current GTM initiatives and getting everyone set up with the accounts and tools we’ve been using.' },
];

const LEAVE_WITH = [
  'Aligned on what we’re building, when, and how',
  'What we’re selling, how we’ll sell it, and milestones across the venture',
  'A shared preliminary product journey map, with risks, unknowns, and flagship features named',
  'Sketches of the key moments',
  'An above-the-line cut, effort estimates, and an MVP launch date',
  'Epics, stories, and requirements in Linear — or whatever ticketing system we use',
  'A refined ICP and a sales journey with owners',
  'A quarterly ops map and roles',
  'Davie’s first sales experiment teed up, and a podcast recorded',
];

const WHO_WHERE: { time: string; curve: string; cube: string }[] = [
  { time: 'Tue 9:00–10:00', curve: 'Everyone — ground the thesis', cube: '—' },
  { time: 'Tue 10:00–11:30', curve: 'Everyone — GTM workshop', cube: '—' },
  { time: 'Tue 11:30–1:00', curve: 'Gitwit All-Hands — Jacob introduces Justin and Davie. Lunch included.', cube: '—' },
  { time: 'Tue 1:00–3:30', curve: 'Product — walk the product experience map', cube: '—' },
  { time: 'Tue 3:30–4:30', curve: 'Product — what we sketch tomorrow', cube: '—' },
  { time: 'Wed 9:00–2:00', curve: 'Product — breadboard and sketch', cube: 'Go-to-market — systems and decks' },
  { time: 'Wed 2:00–3:00', curve: 'Everyone — review product design sketches', cube: '—' },
  { time: 'Wed 3:00–5:00', curve: 'Product — revise', cube: 'Go-to-market — v2 sitemap' },
  { time: 'Thu 9:00–12:00', curve: 'Everyone — features, keep or kill, effort, launch date', cube: '—' },
  { time: 'Thu 1:00–5:00', curve: 'Product — stories and ticketing', cube: 'Go-to-market — site, deck, first motion' },
  { time: 'Fri 9:00–11:30', curve: 'Heads-down wrap-up (product work)', cube: 'Heads-down wrap-up (go-to-market)' },
  { time: 'Fri 11:30–1:30', curve: 'Everyone — Venture Ops, roles, week goals', cube: '—' },
  { time: 'Fri 1:30–3:00', curve: '—', cube: 'Go-to-market — tee up Davie’s first sales experiment' },
  { time: 'Fri 3:00–5:00', curve: '—', cube: 'Podcast — Justin and Davie with Jacob' },
];

export function SprintPage() {
  return (
    <>
      <a className="page-back" href="#/roadmap">
        &larr; Back to roadmap
      </a>

      <section className="hero">
        <p className="eyebrow">Roadmap · Now</p>
        <h1 className="hero-title">Product strategy sprint.</h1>
        <p className="hero-sub">
          Labor Day week — Tuesday September 8 through Friday September 11. After that, Stockton
          Hill runs three weeks (Sep 14–Oct 2) while we start the MVP build.
        </p>
      </section>

      <section className="card phase-card">
        <h2>What we bring into the sprint</h2>
        <ul className="proving-list">
          {INPUTS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <h3 className="sub-label">Goal of the sprint</h3>
        <p className="proof-statement">
          Lock product strategy for the MVP so we can build, and so sales knows what we can sell. By
          Friday we leave aligned on what we’re building, when, and how — what we’re selling, how
          we’ll sell it, and the milestones that keep everyone moving in the same direction.
        </p>
      </section>

      <section className="card phase-card">
        <h2>Plan</h2>
        <h3 className="sub-label">Week at a glance</h3>
        <div className="sprint-days">
          {SPRINT_DAYS.map((d) => (
            <a
              key={d.id}
              className="sprint-day sprint-day-link"
              href={d.href}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = d.href.replace(/^#/, '');
              }}
            >
              <p className="sprint-day-when">
                {d.when} · {d.date}
              </p>
              <h3>{d.theme}</h3>
              {d.glanceBeats.map((b) => (
                <p key={b.label}>
                  <b>{b.label}.</b> {b.text}
                </p>
              ))}
              <p className="sprint-day-open">Open {d.when} &rarr;</p>
            </a>
          ))}
        </div>

        <hr className="soft-rule" />
        <h3 className="sub-label">Roles for the week</h3>
        <ul className="proving-list">
          {ROLES.map((r) => (
            <li key={r.who}>
              <b>{r.who}.</b> {r.ask}
            </li>
          ))}
        </ul>

        <hr className="soft-rule" />
        <h3 className="sub-label">Who is where</h3>
        <p className="proof-statement" style={{ marginBottom: '1rem' }}>
          Two rooms. The Curve is product. The Cube is go-to-market. If we are all together, we sit
          in The Curve.
        </p>
        <table className="sprint-agenda">
          <thead>
            <tr>
              <th>Block</th>
              <th>The Curve</th>
              <th>The Cube</th>
            </tr>
          </thead>
          <tbody>
            {WHO_WHERE.map((row) => (
              <tr key={row.time}>
                <td>{row.time}</td>
                <td>{row.curve}</td>
                <td>{row.cube}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card phase-card">
        <h2>Outcome</h2>
        <h3 className="sub-label">By Friday night</h3>
        <ul className="check-list">
          {LEAVE_WITH.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
