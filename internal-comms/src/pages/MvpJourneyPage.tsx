import { LayeredJourneyMap } from '../components/LayeredJourneyMap';

export function MvpJourneyPage() {
  return (
    <div className="mvp-journey-page">
      <a className="page-back" href="#/sprint">
        &larr; Back to strategy sprint
      </a>

      <section className="hero mvp-journey-hero">
        <p className="eyebrow">Preliminary product journey map · Working draft</p>
        <h1 className="hero-title">MVP journey, layered.</h1>
        <p className="hero-sub">
          A first pass at the product experience map. Revisions are expected.
        </p>
      </section>

      <LayeredJourneyMap />
    </div>
  );
}
