export function PricingStrategy() {
  return (
    <section className="card phase-card home-pricing">
      <h2>Pricing strategy</h2>
      <p className="proof-statement">
        $699 a month. $18 when we shop. If we save you one customer a month, this pays for itself.
      </p>

      <div className="price-split">
        <div>
          <h3>Customer pricing</h3>
          <ul className="strat-list">
            <li>
              <strong>$699 a month</strong> — we reach every renewal, in your voice, and send a
              short questionnaire so you’re not chasing people for updates. Cross-sell and
              referrals sit in that same outreach. Unlimited users. We set you up.
            </li>
            <li>
              <strong>$18 when we shop</strong> — we run the quote work and get it back fast. If
              your team or VAs already shop, skip this and just pay the $699.
            </li>
          </ul>
        </div>
        <div>
          <h3>Assumptions behind the numbers</h3>
          <ul className="strat-list">
            <li>
              We treat every customer as a midsize book: about <strong>1,500 households</strong>.
            </li>
            <li>
              That agency pays us about <strong>$18,000 a year</strong> — $699 × 12, plus 43 shops
              a month at $18 (the reply rate we saw at Members 1st).
            </li>
            <li>
              $1 million ÷ $18,000 = <strong>57 agencies</strong>. That’s the date on each chart.
            </li>
          </ul>
        </div>
      </div>

      <div className="mini-callout">
        <p className="mini-callout-t">Not in the first pitch</p>
        <p>
          <strong>Life commission</strong> — we’re not hanging the price on it. The upside for
          Upline is too small and too unproven. Keep it as a later extra, or drop it.
          <br />
          <strong>AMS</strong> — we do want this, but not as the open. Switching systems sounds
          painful. Bring it later, once they’re already in Upline.
        </p>
      </div>
    </section>
  );
}
