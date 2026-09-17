const LANES = [
  {
    id: 'people',
    n: '1',
    title: 'People',
    objective: 'Get a VA operating so shopping is a system we trust.',
    results: [
      {
        id: '1.1',
        result:
          'Manager-level VA hired (not US W-2; Upline title and exclusivity; reports to Davey). Hired as someone who can later hire, onboard, train, and manage additional VAs.',
        owner: 'Davie',
        by: 'Nov 6',
      },
      {
        id: '1.2',
        result:
          'VA successfully operating. Meaning they know the Upline process, pulls original customer info from the AMS, shops 3 carriers within 24 hours, gets accurate and trusted results to us via email.',
        owner: 'Davie',
        by: 'Dec 6',
      },
    ],
  },
  {
    id: 'capital',
    n: '2',
    title: 'Capital',
    objective: 'Get $250k in verbal commitments so we are not still raising in December.',
    results: [
      {
        id: '2.1',
        result:
          'Pitch deck, data room, and term sheet created to send post-conversation with potential investors.',
        owner: 'JV',
        by: 'Sept 27',
      },
      {
        id: '2.2',
        result:
          '50% progress against a $500k raise. (Interest vs commitments vs cash still to be defined)',
        owner: 'JV',
        by: 'Dec 31',
      },
    ],
  },
  {
    id: 'customers',
    n: '3',
    title: 'Customers',
    objective: 'Build a book of the right agencies, live on the product.',
    results: [
      {
        id: '3.1',
        result: '120 demos booked',
        owner: 'Davey',
        by: 'Nov 30',
      },
      {
        id: '3.2',
        result: '30 contracted/signed',
        owner: 'Davey',
        by: 'Dec 31',
      },
      {
        id: '3.3',
        result: 'At least 3 onboarded onto the live MVP',
        owner: 'Ashley',
        by: 'Dec 31',
      },
      {
        id: '3.4',
        result: 'Upline paperwork finalized and ready for our first contract.',
        owner: 'JV',
        by: 'Oct 6',
      },
    ],
  },
  {
    id: 'product',
    n: '4',
    title: 'Product',
    objective:
      'Put a product in the world an agent will actually use, and an admin experience so the Upline team can manage it.',
    results: [
      {
        id: '4.1',
        result:
          'Sellable agent experience is live and usable for our first customers. Includes: renewal queue, outreach emails, questionnaires, a place for shopping results, policyholder proposal/recommendation. Needs-binding is visible.',
        owner: 'Doug',
        by: 'Nov 6',
      },
      {
        id: '4.2',
        result:
          'Upline admin established and working. Needs to be enough to onboard paying customers and for VAs to do the policyholder management and shopping work.',
        owner: 'Ashley + Doug',
        by: 'Nov 6',
      },
    ],
  },
];

export function OkrPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Progress</p>
        <h1 className="hero-title">First 90-day OKRs.</h1>
        <p className="hero-sub">
          Ashley&rsquo;s draft going into the Thursday team session. Not ratified — will change.
          Period is Sept 15 – Dec 31, 2026.
        </p>
      </section>

      <p className="local-edits-banner">
        Status starts blank. Monthly review uses on track / at risk / off track / complete. No
        decimal scores.
      </p>

      {LANES.map((lane) => (
        <section key={lane.id} className="card phase-card">
          <h2>
            {lane.n}. {lane.title}
          </h2>
          <p className="proof-statement">{lane.objective}</p>
          <div className="list-view" style={{ marginTop: '1rem' }}>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Key result</th>
                  <th>Owner</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {lane.results.map((kr) => (
                  <tr key={kr.id}>
                    <td>
                      <strong>{kr.id}</strong>
                    </td>
                    <td>{kr.result}</td>
                    <td>{kr.owner}</td>
                    <td>{kr.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </>
  );
}
