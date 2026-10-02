const PHASES = ['Outreach', 'Prep', 'Intake', 'Shop', 'Recommend'] as const;

export function JourneySnapshot() {
  return (
    <a className="journey-snapshot" href="#/mvp-journey">
      <div className="journey-snapshot-flow" aria-hidden="true">
        {PHASES.map((label, i) => (
          <div key={label} className="journey-snapshot-stage">
            {i > 0 ? <span className="journey-snapshot-arrow" /> : null}
            <div className="journey-snapshot-card">
              <p className="journey-snapshot-title">{label}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="journey-snapshot-cta">Open the preliminary product journey map &rarr;</p>
    </a>
  );
}
