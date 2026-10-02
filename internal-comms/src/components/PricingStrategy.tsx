export function PricingStrategy() {
  return (
    <>
      <section className="card phase-card">
        <h2>How pricing works</h2>
        <div className="price-how">
          <div className="price-how-col">
            <p className="price-how-kicker">The basis</p>
            <h3>Percentage of personal-lines premium</h3>
            <p>
              Commercial is excluded. A percentage is a tier without hard edges — it scales instead
              of jumping at a threshold. If we shop the book and they lose revenue, we lose money.
            </p>
          </div>
          <div className="price-how-col">
            <p className="price-how-kicker">The agreement</p>
            <h3>24-month partnership</h3>
            <p>
              No implementation fee. Billing starts at the end of month one. Unlimited seats, priced
              at the agency. Shopping is all-in or all-out — we either shop for them or we do not.
            </p>
          </div>
          <div className="price-how-col">
            <p className="price-how-kicker">The guarantee</p>
            <h3>Uplift, not a 90-day out</h3>
            <p>
              We guarantee we increase their retention rate. That is what makes a 24-month signature
              possible before they have seen us work. The threshold number is still to be set.
            </p>
          </div>
        </div>
      </section>

      <section className="card phase-card">
        <h2>Two packages we&rsquo;re testing</h2>
        <p className="export-hint" style={{ marginTop: 0 }}>
          Nobody is anchored to a number yet. The $18 shop fee is a cost we pass through, not a
          profit center. The old $699 / month pitch is dead.
        </p>
        <div className="price-packages">
          <article className="price-package">
            <p className="price-package-kicker">Option A</p>
            <p className="price-package-rate">0.3%</p>
            <p className="price-package-of">of personal-lines premium</p>
            <p className="price-package-plus">plus $18 per shop</p>
            <p className="price-package-note">
              Lower base, shopping billed as it happens. Useful if an owner wants the shop cost
              visible rather than bundled.
            </p>
          </article>
          <article className="price-package is-featured">
            <p className="price-package-kicker">Option B</p>
            <p className="price-package-rate">~0.5%</p>
            <p className="price-package-of">of personal-lines premium</p>
            <p className="price-package-plus">shopping included</p>
            <p className="price-package-note">
              Probably underpriced. Austin&rsquo;s read is closer to 0.6 or 0.7 once VA cost is
              fully loaded. The number we quote still depends on that model.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
