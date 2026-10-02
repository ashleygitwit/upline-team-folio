const GOAL =
  'We wanted to align on what we’re building, when and how, what we’re selling, how we’ll sell it, and the milestones to keep everyone moving in the same direction.';

const DECIDED: {
  kicker: string;
  line: string;
  body: string;
  points?: string[];
  href?: string;
  hrefLabel?: string;
}[] = [
  {
    kicker: 'Venture definition',
    line: 'Upline is the servicing half of the agency, not a tool.',
    body: 'Let the human be human; let the AI be the concierge. We never come out as an AMS, and we never position as “Upline Recommends.” The agent’s name stays on the recommendation.',
  },
  {
    kicker: 'Pricing',
    line: 'Upline is priced as a percentage of personal-lines premium.',
    body: 'The flat SaaS fee is dead. A percentage aligns us with the book: if we shop it and they lose revenue, we lose money. The percentage itself is still open.',
    points: ['24-month agreement', 'Unlimited seats', 'Shopping all-in or all-out', 'Uplift guarantee, not a 90-day out'],
  },
  {
    kicker: 'Launch date',
    line: 'Product launch November 6.',
    body: 'Seven surfaces sit above the line. The BI dashboard was cut — stats ship as an email. Design done October 2. Freeze October 23.',
    href: '#/breadboard',
    hrefLabel: 'Open the product breadboard',
  },
  {
    kicker: 'Go-to-market',
    line: 'One metric that matters: 120 demos by end of November.',
    body: 'Paid top-of-funnel video is the swing play. Cold outbound continues alongside it. Austin spends more time on go-to-market than product.',
  },
];

const TAKEAWAYS = [
  'The $699 SaaS pitch died. We price as a percentage of personal-lines premium.',
  'The dashboard was cut from MVP and ships as a month-in-review email.',
  'We are the servicing half of the agency — not a tool, and not an AMS.',
  'GTM is a volume problem: 120 demos booked by November 30.',
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
        <div className="sprint-decided">
          {DECIDED.map((item) => (
            <article key={item.kicker} className="sprint-decided-card">
              <p className="sprint-decided-kicker">{item.kicker}</p>
              <h3>{item.line}</h3>
              <p>{item.body}</p>
              {item.points ? (
                <ul className="sprint-decided-points">
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              ) : null}
              {item.href ? (
                <a className="sprint-decided-link" href={item.href}>
                  {item.hrefLabel} &rarr;
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="card phase-card">
        <h2>Biggest takeaways from the week</h2>
        <ul className="sprint-takeaways">
          {TAKEAWAYS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
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
