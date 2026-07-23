interface Member {
  name: string;
  role: string;
  photo: string;
  owns: string;
  // Short pill topics (for the lighter-touch cards) OR longer fragments (for the
  // core builders — Ashley + Austin — whose cards carry more detail).
  chips?: string[];
  bullets?: string[];
}

// Placeholder content — role framed as what each person owns, plus what to reach out about.
// Ashley will edit the specifics per person.
const TEAM: Member[] = [
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
    name: 'Justin Valenzuela',
    role: 'Industry Expert · SME',
    photo: '/team/justin.png',
    owns: 'Our subject-matter expert and design partner — deep P&C domain knowledge that keeps the product grounded in reality.',
    chips: ['Insurance domain knowledge', 'How agencies really operate', 'Reality-checking our assumptions'],
  },
  {
    name: 'Amanda Treadwell',
    role: 'Design',
    photo: '/team/amanda.webp',
    owns: 'Owns brand standards and the visual design identity.',
    chips: ['Brand standards', 'Visual design'],
  },
  {
    name: 'Leander Howard II',
    role: 'Go-to-Market',
    photo: '/team/leander.png',
    owns: 'Owns go-to-market — the approach and the tactics.',
    chips: ['GTM approach', 'GTM tactics'],
  },
  {
    name: 'Claire Ballew',
    role: 'Brand Voice',
    photo: '/team/claire.webp',
    owns: 'Owns brand voice — how Upline sounds.',
    chips: ['Brand voice'],
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
            <img className="team-photo" src={m.photo} alt={m.name} loading="lazy" />
            <div className="team-body">
              <h2 className="team-name">{m.name}</h2>
              <p className="team-role">{m.role}</p>
              <p className="team-owns">{m.owns}</p>
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
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
