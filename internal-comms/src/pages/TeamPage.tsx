interface Member {
  name: string;
  role: string;
  photo?: string;
  circlePhoto?: boolean;
  owns: string;
  // Short pill topics (for the lighter-touch cards) OR longer fragments (for the
  // core builders — Ashley + Austin — whose cards carry more detail).
  chips?: string[];
  bullets?: string[];
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter((part) => part && part !== 'II')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

// Order is the page: Justin + Davie on the top row, then Douglas, Austin,
// Ashley, Amanda, Claire, Leander, Jacob, Dan. Copy for the new / moved
// cards follows the sprint-week expectation email.
const TEAM: Member[] = [
  {
    name: 'Justin Valenzuela',
    role: 'CEO',
    photo: '/team/justin.png',
    owns: 'CEO and agent SME — how agents perceive value, what they’ll pay for, and how we sell this.',
  },
  {
    name: 'Davie Holt',
    role: 'Founding Head of Sales',
    photo: '/team/davie.png?v=2',
    circlePhoto: true,
    owns: 'Founding Head of Sales — VA hiring and management, plus go-to-market and sales strategy with Justin.',
  },
  {
    name: 'Douglas Sheridan',
    role: 'Founding Engineer',
    photo: '/team/douglas.png?v=2',
    circlePhoto: true,
    owns: 'Founding engineer — what to build, how to build it, and what’s realistic in the time we have.',
  },
  {
    name: 'Austin Boardman',
    role: 'Product Strategy',
    photo: '/team/austin.webp',
    owns: 'Owns product strategy — with a focus on data and technical feasibility.',
    bullets: [
      'Where we source the data that informs the product',
      "How the RPA is built (and where it's headed)",
      'What the shopping process looks like',
      'How the team and VAs interact with carriers',
    ],
  },
  {
    name: 'Ashley Roberts',
    role: 'Venture Lead',
    photo: '/team/ashley.webp',
    owns: "Owns Upline Venture's success — with a focus on client desirability and user experience.",
    bullets: [
      'Timeline and scope',
      'Where we are at any given point',
      'Venture and pilot learnings so far',
      'Email outreach and recommendation logic',
    ],
  },
  {
    name: 'Amanda Treadwell',
    role: 'Design',
    photo: '/team/amanda.webp',
    owns: 'Owns brand standards and the visual design identity.',
    chips: ['Brand standards', 'Visual design'],
  },
  {
    name: 'Claire Ballew',
    role: 'Brand Voice',
    photo: '/team/claire.webp',
    owns: 'Owns brand voice — how Upline sounds.',
    chips: ['Brand voice'],
  },
  {
    name: 'Leander Howard II',
    role: 'Go-to-Market',
    photo: '/team/leander.png',
    owns: 'Owns go-to-market — the approach and the tactics.',
    chips: ['GTM approach', 'GTM tactics'],
  },
  {
    name: 'Jacob Johnson',
    role: 'Business Strategy',
    photo: '/team/jacob.png',
    owns: 'Owns venture and business strategy — how Upline succeeds as a business.',
    chips: ['Business strategy', 'Venture success'],
  },
  {
    name: 'Dan Fisher',
    role: 'Research & Discovery',
    photo: '/team/dan.webp',
    owns: 'Owns the original findings and insights — how it all started.',
    chips: ['Original findings', 'Foundational insights'],
  },
];

export function TeamPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Team</p>
        <h1 className="hero-title">Who&rsquo;s building Upline.</h1>
        <p className="hero-sub">
          The people behind the venture — framed by what they own and what to reach out about, not
          just titles.
        </p>
      </section>

      <section className="team-grid">
        {TEAM.map((m) => (
          <article key={m.name} className="team-card">
            {m.photo ? (
              <img
                className={m.circlePhoto ? 'team-photo team-photo-circle' : 'team-photo'}
                src={m.photo}
                alt={m.name}
                loading="lazy"
              />
            ) : (
              <span className="team-photo team-photo-fallback" aria-hidden="true">
                {initials(m.name)}
              </span>
            )}
            <div className="team-body">
              <h2 className="team-name">{m.name}</h2>
              <p className="team-role">{m.role}</p>
              <p className="team-owns">{m.owns}</p>
              {m.bullets?.length || m.chips?.length ? (
                <div className="team-focus">
                  <span className="team-focus-label">Reach out to ask about</span>
                  {m.bullets ? (
                    <ul className="team-list">
                      {m.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="team-tags">
                      {m.chips?.map((t) => (
                        <li key={t} className="team-tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
