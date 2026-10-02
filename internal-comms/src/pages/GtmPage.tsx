const LANES: { lane: string; owner: string; model: string }[] = [
  {
    lane: 'Warm outbound',
    owner: 'Davie',
    model:
      'Runs as its own workflow, his CRM and his tools. We assist on request; we do not manage it.',
  },
  {
    lane: 'Paid social',
    owner: 'Austin',
    model: 'The swing play. Paid video, not influencer. Instrumentation is the hard part.',
  },
  {
    lane: 'Website',
    owner: 'Claire',
    model: 'v2 on quality. Conference QR page is the urgent piece and unblocks paid.',
  },
  {
    lane: 'Press / founder posting',
    owner: 'Claire → Davie / Justin',
    model: 'Claire drafts the press release and demos the posting workflow; they run it.',
  },
  {
    lane: 'Conferences',
    owner: 'Austin / Davie / Brandon',
    model: 'SIA and young agents this week. The ask is a demo that leads into the investment conversation.',
  },
];

const RAMP: {
  phase: string;
  weeks: string;
  rate: string;
  total: number;
  carried: string;
}[] = [
  {
    phase: 'Ramp',
    weeks: 'Sep 14–Oct 2',
    rate: '~6 booked / week',
    total: 18,
    carried: 'Warm and cold outbound, plus the two conferences',
  },
  {
    phase: 'Paid contributes',
    weeks: 'Oct 5–23',
    rate: '~12 booked / week',
    total: 54,
    carried: 'Outbound plus paid as the algorithm learns',
  },
  {
    phase: 'Paid at scale',
    weeks: 'Oct 26–Nov 30',
    rate: '~14 booked / week',
    total: 124,
    carried: 'Paid leading, outbound steady',
  },
];

const TARGET = 120;

const MILESTONES: { date: string; what: string; owner: string }[] = [
  { date: 'Wed Sep 16', what: 'SIA — 3,300 in the room, ~15,000 rebroadcast', owner: 'Brandon, Austin' },
  { date: 'Thu–Fri Sep 17–18', what: 'Young agents conference', owner: 'Davie' },
  { date: 'Fri Sep 18', what: 'Paid social v1 live, against a standalone landing page', owner: 'Austin' },
  { date: 'Fri Oct 2', what: 'Ramp checkpoint — ~18 booked', owner: 'Austin' },
  { date: 'Fri Nov 6', what: 'Product launch, first customer live', owner: '—' },
  { date: 'Sun Nov 30', what: '120 demos booked', owner: 'Austin, Davie' },
  { date: 'Wed Dec 31', what: '~30 contracts closed', owner: 'Austin, Davie' },
];

export function GtmPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Progress</p>
        <h1 className="hero-title">GTM approach.</h1>
        <p className="hero-sub">
          The objective is 120 demos booked by November 30. That is the one number. Roughly 90 held
          at a 75% show rate. Target is ~30 contracts closed by December 31.
        </p>
      </section>

      <section className="card phase-card">
        <h2>The ramp to 120</h2>
        <p className="export-hint" style={{ marginTop: 0 }}>
          Paid social cannot carry the early weeks. Instrumentation takes about a month to start
          working, so the first stretch is outbound and conferences. If we are not at ~18 booked by
          October 2, the November number is already gone.
        </p>

        <div className="gtm-ramp" role="img" aria-label="Cumulative demos ramp from 18 to 54 to 124 against a 120 target.">
          <div className="gtm-ramp-goal">
            <span className="gtm-ramp-goal-n">{TARGET}</span>
            <span className="gtm-ramp-goal-l">demos booked by Nov 30</span>
          </div>
          <div className="gtm-ramp-chart">
            {RAMP.map((row) => (
              <div key={row.phase} className="gtm-ramp-col">
                <div className="gtm-ramp-plot">
                  <div
                    className="gtm-ramp-bar"
                    style={{ height: `${Math.round((row.total / 124) * 100)}%` }}
                  >
                    <span className="gtm-ramp-total">~{row.total}</span>
                  </div>
                </div>
                <p className="gtm-ramp-phase">{row.phase}</p>
                <p className="gtm-ramp-weeks">{row.weeks}</p>
                <p className="gtm-ramp-rate">{row.rate}</p>
                <p className="gtm-ramp-carried">{row.carried}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="card phase-card">
        <h2>Upcoming milestones</h2>
        <ol className="gtm-milestones">
          {MILESTONES.map((row) => (
            <li key={row.date}>
              <p className="gtm-milestone-date">{row.date}</p>
              <div>
                <p className="gtm-milestone-what">{row.what}</p>
                <p className="gtm-milestone-owner">{row.owner}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="card phase-card">
        <h2>Lanes and owners</h2>
        <div className="list-view">
          <table>
            <thead>
              <tr>
                <th>Lane</th>
                <th>Owner</th>
                <th>Operating model</th>
              </tr>
            </thead>
            <tbody>
              {LANES.map((row) => (
                <tr key={row.lane}>
                  <td>
                    <strong>{row.lane}</strong>
                  </td>
                  <td>{row.owner}</td>
                  <td>{row.model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
