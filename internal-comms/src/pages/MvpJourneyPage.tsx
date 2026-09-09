import { LayeredJourneyMap } from '../components/LayeredJourneyMap';
import { SURFACES } from '../data/mvpJourney';

export function MvpJourneyPage() {
  return (
    <div className="mvp-journey-page">
      <a className="page-back" href="#/sprint">
        &larr; Back to strategy sprint
      </a>

      <section className="hero mvp-journey-hero">
        <p className="eyebrow">Tuesday Sept 8 walk · working draft</p>
        <h1 className="hero-title">MVP journey, layered.</h1>
        <p className="hero-sub">
          After the product-room walk. Emails go unless they stop them. The insured gets a
          landing page. Close is a loop, not a blank. Onboard is a sibling — this map starts
          after contract.
        </p>
      </section>

      <section className="journey-surfaces" aria-label="Always-on surfaces">
        <p className="journey-surfaces-kicker">Always on · not sequential steps</p>
        <h2 className="journey-surfaces-title">What they see when they log in</h2>
        <div className="journey-surfaces-grid">
          {SURFACES.map((surface) => (
            <article key={surface.id} className="journey-surface">
              <p className="journey-surface-who">{surface.who}</p>
              <h3>{surface.name}</h3>
              <p>{surface.experience}</p>
              <ul>
                {surface.shows.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <LayeredJourneyMap />
    </div>
  );
}
