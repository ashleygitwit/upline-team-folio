const LANES = [
  {
    id: 'people',
    n: '1',
    title: 'People',
    objective:
      'We’ve hired and onboarded a manager-level VA who is able to efficiently shop for Upline so that it does not become a founder bottleneck.',
    results: [
      {
        id: '1.1',
        result:
          'Manager-level VA hired. Hired as someone who can later hire, onboard, train, and manage additional VAs.',
        owner: 'Davie',
        by: 'Oct 7 (ASAP)',
      },
      {
        id: '1.2',
        result:
          'VA successfully operating. Meaning they know the Upline process, pulls original customer info from the AMS, shops 3 carriers within 1-2 business days, gets accurate and trusted results to us via email.',
        owner: 'Davie',
        by: 'Nov 6',
      },
      {
        id: '1.3',
        result:
          'Onboarding and logistics in place. This includes: Gusto or equivalent setup, security and permissions, an IT plan, and a written onboarding process.',
        owner: 'Austin',
        by: 'Oct 7',
      },
    ],
  },
  {
    id: 'capital',
    n: '2',
    title: 'Capital',
    objective: 'Get $250k in verbal commitments by the end of the year.',
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
        result: '25% progress against a $1M raise.',
        owner: 'JV',
        by: 'Dec 31',
      },
      {
        id: '2.3',
        result: 'SVR is created.',
        owner: 'JV/Mike',
        by: 'Oct 7',
      },
    ],
  },
  {
    id: 'customers',
    n: '3',
    title: 'Customers',
    objective: 'Get 30 of the right agencies contracted, with at least 3 live on the product.',
    results: [
      {
        id: '3.1',
        result: '120 demos booked',
        owner: 'Davie',
        by: 'Nov 30',
      },
      {
        id: '3.2',
        result: '30 contracted/signed',
        owner: 'Davie',
        by: 'Dec 31',
      },
      {
        id: '3.3',
        result: 'At least 3 (shopping agencies) onboarded onto the live MVP',
        owner: 'Ashley',
        by: 'Dec 31',
      },
      {
        id: '3.4',
        result: 'Upline paperwork finalized and ready for our first contract.',
        owner: 'Mike',
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
          'Sellable agent experience is live and usable for our first customers. Includes: renewal queue, outreach emails, questionnaires, a place for shopping results, policyholder proposal/recommendation. Needs-binding is visible',
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
      {
        id: '4.3',
        result: 'Clickable Demo created and used by sales team',
        owner: 'Ashley',
        by: 'Oct 1',
      },
      {
        id: '4.4',
        result:
          'Design customer (pilot customer 3) is chosen, setup, onboarded, and using some version of Upline',
        owner: 'Mike/JV',
        by: 'Oct 19',
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
          Revised in the first company weekly, Thursday Sep 17. Period is Sept 15 – Dec 31, 2026.
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
