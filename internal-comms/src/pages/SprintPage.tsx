const GOAL =
  'We wanted to align on what we’re building, when and how, what we’re selling, how we’ll sell it, and the milestones to keep everyone moving in the same direction.';

const DECIDED = [
  {
    title: 'What Upline is',
    body: 'The servicing half of the agency, not a tool. Let the human be human; let the AI be the concierge. We never come out as an AMS, and we never position as “Upline Recommends.”',
  },
  {
    title: 'Pricing',
    body: 'The flat SaaS fee is dead. We price as a percentage of personal-lines premium, 24-month agreement, unlimited seats, shopping all-in or all-out. The percentage itself is still open.',
  },
  {
    title: 'November 6 line',
    body: 'Seven surfaces above the line: renewal queue, outreach review and send, questionnaire, VA shopping of three carriers, shop results, the insured proposal, and a needs-binding state that cannot silently disappear. The BI dashboard was cut — stats ship as an email.',
  },
  {
    title: 'Go-to-market',
    body: 'One metric that matters: 120 demos booked by end of November. Paid top-of-funnel video is the swing play. Austin spends more time on GTM than product.',
  },
];

const TAKEAWAYS = [
  {
    title: 'The $699 pitch died in the room',
    body: 'SaaS pricing made us sound like the thing we said we were not. Percentage of personal-lines premium, a 24-month partnership, and an uplift guarantee instead of a 90-day out. That was the week’s biggest pivot.',
  },
  {
    title: 'The dashboard did not survive keep-or-kill',
    body: 'Tuesday voted it a flagship. Thursday cut it. The owner still gets the numbers — as a month-in-review email — so November 6 can ship seven surfaces instead of a reporting product.',
  },
  {
    title: 'We are not a tool, and we are not an AMS',
    body: 'The working analogy is COO: don’t worry about it, we’ve got this. Coming out as a system of record puts us in a feature-parity trap. The agent’s name stays on the recommendation.',
  },
  {
    title: 'GTM is a volume problem, not a deck problem',
    body: '120 demos booked by November 30 is the number. Paid video is the swing play, outbound stays, and Austin’s time shifts toward go-to-market rather than pulling Doug off the build.',
  },
];

const DAYS = [
  {
    when: 'Tuesday',
    date: 'September 8',
    theme: 'Sales and product journeys',
    body: 'We mapped the sales journey from awareness through onboarding, then walked the product experience map together and named the flagship moments to sketch the next day.',
  },
  {
    when: 'Wednesday',
    date: 'September 9',
    theme: 'Sketch the product and set up go-to-market efforts',
    body: 'Product sketched the flagship moments. Go-to-market got onto the systems, started the decks, and mapped the v2 site. The afternoon review is where the dashboard started to come apart.',
  },
  {
    when: 'Thursday',
    date: 'September 10',
    theme: 'Keep or kill, and set the launch date',
    body: 'We drew the MVP line — seven surfaces above it, the BI dashboard cut to an email — and set November 6. The pricing conversation killed the $699 SaaS fee in favor of a percentage of personal-lines premium.',
  },
  {
    when: 'Friday',
    date: 'September 11',
    theme: 'Venture operations',
    body: 'We named roles through year-end, set the Tuesday company weekly, teed up Davie’s first sales experiment, and recorded the podcast with Justin and Davie.',
  },
];

export function SprintPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Progress</p>
        <h1 className="hero-title">Product strategy sprint.</h1>
        <p className="hero-sub">{GOAL}</p>
      </section>

      <section className="card phase-card">
        <h2>What we decided</h2>
        <div className="metric-grid">
          {DECIDED.map((item) => (
            <div key={item.title} className="metric-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card phase-card">
        <h2>Biggest takeaways from the week</h2>
        <div className="metric-grid">
          {TAKEAWAYS.map((item) => (
            <div key={item.title} className="metric-card">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card phase-card">
        <h2>What we accomplished</h2>
        <div className="sprint-days">
          {DAYS.map((d) => (
            <div key={d.when} className="sprint-day">
              <p className="sprint-day-when">
                {d.when} · {d.date}
              </p>
              <h3>{d.theme}</h3>
              <p>{d.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
