import { SPRINT_DAYS } from '../data/sprintDays';

const INPUTS = [
  'Members 1st run end-to-end, plus Stockton Hill in flight — two very different agencies',
  'A drafted MVP experience and an early pricing approach treated as a constraint',
  'Real funnel and engagement data: response rates, opt-ins, and what actually drove a shop',
  'A clear read on which work is VA-assisted vs. automatable, and the cost to run it',
];

const LEAVE_WITH = [
  'A shared product journey from the strawman, with risks, unknowns, and flagship features named',
  'Sketches of the key moments',
  'An above-the-line cut, T-shirt sizes, and a dated launch',
  'Epics, stories, and requirements in Linear',
  'A refined ICP and a sales journey with owners',
  'A quarterly ops map and roles — including JV as standing CEO',
  'Davey’s first experiment launched, and a podcast recorded',
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
          Week of September 8. Four days, Tuesday through Friday. Product and go-to-market run in
          parallel. Tuesday maps both journeys. Wednesday sketches. Thursday is plan, scope, and
          requirements. Friday is ops, then Davey’s first launch, then the podcast.
        </p>
      </section>

      <section className="card phase-card">
        <h2>Goal</h2>
        <h3 className="sub-label">What we bring in</h3>
        <ul className="proving-list">
          {INPUTS.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="proof-statement" style={{ marginTop: '1.4rem' }}>
          Lock product strategy for the MVP so we can build, and so sales knows what is real. If the
          bet is wrong, we change the bet. If the experience does not serve the bet, we change the
          experience. We do not do both at once.
        </p>
      </section>

      <section className="card phase-card">
        <h2>Plan</h2>
        <p className="proof-statement" style={{ marginBottom: '1rem' }}>
          The strawman journey map is what we put on the wall Tuesday at 1:30. We do not start from a
          blank.
        </p>
        <a className="arc-cta" href="#/mvp-journey">
          Open the MVP journey map &rarr;
        </a>

        <hr className="soft-rule" />
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
              <p className="sprint-day-when">{d.when}</p>
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
      </section>

      <section className="card phase-card">
        <h2>Outcome</h2>
        <h3 className="sub-label">By Friday night</h3>
        <ul className="check-list">
          {LEAVE_WITH.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
        <p className="proof-statement" style={{ marginTop: '1.4rem' }}>
          Thursday afternoon stands up the build in Linear — epics, stories, requirements. Friday
          morning maps the company. Davey’s first experiment goes live after lunch.
        </p>
      </section>
    </>
  );
}
