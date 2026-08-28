const INPUTS = [
  'Members 1st run end-to-end, plus Stockton Hill in flight — two very different agencies',
  'A drafted MVP experience and an early pricing approach treated as a constraint',
  'Real funnel and engagement data: response rates, opt-ins, and what actually drove a shop',
  'A clear read on which work is VA-assisted vs. automatable, and the cost to run it',
];

const DAYS: {
  when: string;
  theme: string;
  beats: { label: string; text: string }[];
}[] = [
  {
    when: 'Monday',
    theme: 'Lock the bet, then turn it into a path.',
    beats: [
      {
        label: 'Morning',
        text: 'Start with the evidence. Pressure-test the bet, define the 90-day win, and draw the MVP line — what is above the line versus on ice.',
      },
      {
        label: 'Afternoon',
        text: 'Walk the drafted journey and rebuild it together. The map stays off the wall until this session.',
      },
    ],
  },
  {
    when: 'Tuesday',
    theme: 'Make the three moments concrete.',
    beats: [
      {
        label: 'Morning',
        text: 'Pick the three most important touchpoints and breadboard each one: what lives here, what someone can do, and what decision it supports.',
      },
      {
        label: 'Afternoon',
        text: 'Ashley and Amanda sketch those breadboards. Austin and the engineer work logistics, data, and feasibility against the same three moments. End of day: hold or revise the direction.',
      },
    ],
  },
  {
    when: 'Wednesday',
    theme: 'Go heads-down and make the experience legible.',
    beats: [
      {
        label: 'Morning',
        text: 'Ashley and Amanda keep going on wires and visual direction. Austin and the engineer keep going on research, logistics, and onboarding.',
      },
      {
        label: 'Afternoon',
        text: 'Same split. Reviews stay sparse. Leave with enough to write the spec the following week.',
      },
    ],
  },
];

const LEAVE_WITH = [
  'A product bet we either held or revised',
  '90-day success criteria',
  'A clear above-the-line MVP scope and an on-ice list',
  'A shared user journey map',
  'Three breadboarded touchpoints',
  'First-pass wires and design direction',
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
          Week of September 8. Three days in the room, Monday through Wednesday. Thursday and Friday
          are company-wide — no Upline work those days. We are not starting discovery from zero.
          The job is to decide what we believe, check the experience against that belief, and leave
          ready to write a short build spec the following week.
        </p>
      </section>

      {/* GOAL */}
      <section className="card phase-card">
        <h2>Goal</h2>
        <h3 className="sub-label">What we bring in</h3>
        <ul className="proving-list">
          {INPUTS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="proof-statement" style={{ marginTop: '1.4rem' }}>
          Lock product strategy for the MVP so we can build. If the bet is wrong, we change the bet.
          If the experience does not serve the bet, we change the experience. We do not do both at
          once.
        </p>
      </section>

      {/* PLAN */}
      <section className="card phase-card">
        <h2>Plan</h2>
        <p className="proof-statement" style={{ marginBottom: '1rem' }}>
          The strawman journey map is what we bring to the room.
        </p>
        <a className="arc-cta" href="#/mvp-journey">
          Open the MVP journey map &rarr;
        </a>

        <hr className="soft-rule" />
        <h3 className="sub-label">Week at a glance</h3>
        <div className="sprint-days">
          {DAYS.map((d) => (
            <div key={d.when} className="sprint-day">
              <p className="sprint-day-when">{d.when}</p>
              <h3>{d.theme}</h3>
              {d.beats.map((b) => (
                <p key={b.label}>
                  <b>{b.label}.</b> {b.text}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* OUTCOME */}
      <section className="card phase-card">
        <h2>Outcome</h2>
        <h3 className="sub-label">By Wednesday night</h3>
        <ul className="check-list">
          {LEAVE_WITH.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="proof-statement" style={{ marginTop: '1.4rem' }}>
          The week after, we write a short build spec from the sprint output — what to build, how
          we know it is done, what is in, and what is on ice. Readable by an engineer and a
          designer. Not a hundred tickets.
        </p>
      </section>
    </>
  );
}
