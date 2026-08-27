import { LayeredJourneyMap } from '../components/LayeredJourneyMap';

export function MvpJourneyPage() {
  return (
    <div className="mvp-journey-page">
      <a className="page-back" href="#/sprint">
        &larr; Back to strategy sprint
      </a>

      <section className="hero mvp-journey-hero">
        <p className="eyebrow">Sprint strawman · Working draft</p>
        <h1 className="hero-title">MVP journey, layered.</h1>
        <p className="hero-sub">
          Each column is one action, in one lane. Upline is the product. VA is the people
          on Upline’s side. Layers on the map: experience, wireframe, data written,
          operational logic, and agent value. Functionality lives at the bottom when you
          open a step.
        </p>
      </section>

      <LayeredJourneyMap />
    </div>
  );
}
