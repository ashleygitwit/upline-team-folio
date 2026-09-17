import { PricingStrategy } from '../components/PricingStrategy';

export function PricingPage() {
  return (
    <>
      <section className="hero">
        <p className="eyebrow">Context</p>
        <h1 className="hero-title">We don&rsquo;t do SaaS. We do partnerships.</h1>
        <p className="hero-sub">
          Upline is priced as a percentage of personal-lines premium — so if we shop the book and
          they lose revenue, we lose money.
        </p>
      </section>
      <PricingStrategy />
    </>
  );
}
