import { useMemo, useState } from 'react';
import { OutreachFunnel } from '../components/OutreachFunnel';
import { RANGE_VIEWS } from '../data/dashboardWireframe';
import {
  AGENCY,
  BANDS,
  SNAPSHOTS,
  SPOT_CHECKS,
  TRAIL_WHO,
  VERDICT,
  WORTH_KNOWING,
  WORTH_KNOWING_KINDS,
  type FieldSnapshot,
} from '../data/ownerView';

const COLS = 70;

/**
 * The book as one mark per household, laid out freshest first. Scattering the
 * bands makes the two snapshots read as two piles of confetti; in freshness
 * order the boundary sweeps down the field and the fill is the whole point.
 */
function BookField({ snapshot }: { snapshot: FieldSnapshot }) {
  const total = AGENCY.bookSize;
  const rows = Math.ceil(total / COLS);
  const step = 9;

  // Cumulative band cutoffs for this snapshot, walked against each household's rank.
  const cutoffs = useMemo(() => {
    let run = 0;
    return BANDS.map((band) => {
      run += band[snapshot];
      return { color: band.color, upTo: run };
    });
  }, [snapshot]);

  function colorFor(rank: number) {
    const hit = cutoffs.find((c) => rank < c.upTo);
    return hit ? hit.color : BANDS[BANDS.length - 1].color;
  }

  return (
    <svg
      className="ov-field-svg"
      viewBox={`0 0 ${COLS * step} ${rows * step}`}
      role="img"
      aria-label={`${total} households, coloured by how long since anyone contacted them`}
    >
      {Array.from({ length: total }, (_, i) => (
        <circle
          key={i}
          cx={(i % COLS) * step + step / 2}
          cy={Math.floor(i / COLS) * step + step / 2}
          r={3.1}
          fill={colorFor(i)}
        />
      ))}
    </svg>
  );
}

export function OwnerViewPage() {
  const [snapshot, setSnapshot] = useState<FieldSnapshot>('now');
  const [checkId, setCheckId] = useState(SPOT_CHECKS[0].id);
  const snapshotNote = SNAPSHOTS.find((s) => s.id === snapshot);
  const check = SPOT_CHECKS.find((c) => c.id === checkId) ?? SPOT_CHECKS[0];
  const quiet = BANDS[BANDS.length - 1];

  function pickRandom() {
    const others = SPOT_CHECKS.filter((c) => c.id !== checkId);
    setCheckId(others[Math.floor(Math.random() * others.length)].id);
  }

  return (
    <div className="ov-page">
      <a className="page-back" href="#/mvp-journey">
        &larr; Back to the MVP journey
      </a>

      <section className="ov-intro">
        <p className="eyebrow">Wireframe · agency owner, weekly</p>
        <h1 className="hero-title">Nothing has gone quiet.</h1>
        <p className="hero-sub">
          The owner delegated retention outreach and could never verify it happened. So this screen
          is not a report on our metrics &mdash; it is his book, and proof that nothing in it came
          due untouched. Retention and money are the standing headline; coverage is what changes
          each week. The metrics dashboard is the other take on this.
        </p>
      </section>

      <div className="ov-shell">
        <header className="ov-chrome">
          <div>
            <p className="ov-agency">{AGENCY.name}</p>
            <p className="ov-chrome-sub">
              {AGENCY.today} &middot; {AGENCY.bookSize.toLocaleString()} households &middot; Upline
              since {AGENCY.startedOn}
            </p>
          </div>
          <p className="ov-lastlook">
            Since you last looked &mdash; {VERDICT.sinceLastLook.days} days ago
          </p>
        </header>

        {/* The verdict. Answerable in five seconds, and the same on both devices. */}
        <section className="ov-verdict" aria-label="This week's verdict">
          <div className="ov-verdict-main">
            <p className="ov-verdict-head">{VERDICT.headline}</p>
            <p className="ov-verdict-line">
              <strong>
                {VERDICT.dueCovered} of {VERDICT.dueCount}
              </strong>{' '}
              households with a renewal in the {VERDICT.dueWindow} have been reached.
            </p>
            <p className="ov-verdict-line">
              <strong>{VERDICT.unattendedEver}</strong> renewals have passed unattended since{' '}
              {AGENCY.startedOn}.
            </p>
            <p className="ov-verdict-delta">
              +{VERDICT.sinceLastLook.reached} households reached since you last looked &middot;{' '}
              {VERDICT.sinceLastLook.wentQuiet} went quiet
            </p>
            <p className="ov-verdict-standing">
              Since {AGENCY.startedOn}: {VERDICT.standing.kept} of {VERDICT.standing.cameDue}{' '}
              renewals kept &mdash; {VERDICT.standing.retentionPct} &mdash; and{' '}
              {VERDICT.standing.commission} in commission you would have lost at your old rate.
            </p>
          </div>

          {/* Same artifact, smaller zoom. He reads this one standing up. */}
          <div className="ov-phone" aria-label="The same verdict on his phone">
            <div className="ov-phone-screen">
              <p className="ov-phone-kicker">Upline &middot; Monday 8:00</p>
              <p className="ov-phone-head">Nothing has gone quiet.</p>
              <p className="ov-phone-line">
                {VERDICT.dueCovered} of {VERDICT.dueCount} renewals in the next 30 days are covered.
                None has ever passed unattended.
              </p>
              <div className="ov-phone-rule" />
              <p className="ov-phone-sub">3 people worth a call</p>
              <ul className="ov-phone-list">
                {WORTH_KNOWING.slice(0, 3).map((w) => (
                  <li key={w.id}>
                    <strong>{w.name}</strong> {w.said}
                  </li>
                ))}
              </ul>
              <div className="ov-phone-rule" />
              <p className="ov-phone-foot">
                Since June: {VERDICT.standing.kept} of {VERDICT.standing.cameDue} kept &middot;{' '}
                {VERDICT.standing.commission}
              </p>
            </div>
          </div>
        </section>

        {/* The illustration: his book, not our funnel. */}
        <section className="ov-block" aria-label="Your book by contact freshness">
          <div className="ov-block-head">
            <div>
              <p className="ov-kicker">Your book</p>
              <h2>Every household you have, and when anyone last spoke to them</h2>
              <p className="ov-block-note">
                One mark per household, freshest first. You have never seen this before, because an
                AMS is organised around policies, not attention.
              </p>
            </div>
            <div className="ov-toggle" role="group" aria-label="Snapshot">
              {SNAPSHOTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={snapshot === s.id ? 'is-on' : undefined}
                  aria-pressed={snapshot === s.id}
                  onClick={() => setSnapshot(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="ov-legend">
            {BANDS.map((band) => (
              <li key={band.id}>
                <span className="ov-legend-dot" style={{ background: band.color }} />
                <span className="ov-legend-count">{band[snapshot].toLocaleString()}</span>
                <span className="ov-legend-label">{band.label}</span>
              </li>
            ))}
          </ul>

          <BookField snapshot={snapshot} />

          <p className="ov-caption">{snapshotNote?.caption}</p>
        </section>

        {/* Verification, not reporting. A tool that only returns good news is not one. */}
        <section className="ov-block" aria-label="Spot-check any household">
          <div className="ov-block-head">
            <div>
              <p className="ov-kicker">Spot-check</p>
              <h2>Do not take our word for it. Pick a household.</h2>
              <p className="ov-block-note">
                Everything that happened, dated, including the ones you stopped and the ones we have
                not reached yet.
              </p>
            </div>
            <button type="button" className="ov-random" onClick={pickRandom}>
              Pick one at random
            </button>
          </div>

          <div className="ov-check">
            <div className="ov-check-picker" role="group" aria-label="Household">
              {SPOT_CHECKS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={checkId === c.id ? 'is-on' : undefined}
                  aria-pressed={checkId === c.id}
                  onClick={() => setCheckId(c.id)}
                >
                  {c.name}
                </button>
              ))}
            </div>

            <article className="ov-trail">
              <header>
                <p className="ov-trail-name">
                  {check.name}
                  <span className={`ov-status is-${check.id === 'ray' ? 'cold' : 'warm'}`}>
                    {check.status}
                  </span>
                </p>
                <p className="ov-trail-meta">{check.meta}</p>
              </header>
              <ol className="ov-trail-list">
                {check.trail.map((entry, i) => (
                  <li key={i} className={`is-${entry.who}`}>
                    <span className="ov-trail-date">{entry.date}</span>
                    <span className="ov-trail-who">{TRAIL_WHO[entry.who]}</span>
                    <span className="ov-trail-text">{entry.text}</span>
                  </li>
                ))}
              </ol>
            </article>
          </div>
        </section>

        {/* The only thing on this screen he is uniquely qualified to do. */}
        <section className="ov-block" aria-label="Worth knowing">
          <div className="ov-block-head">
            <div>
              <p className="ov-kicker">Worth knowing</p>
              <h2>{WORTH_KNOWING.length} people worth a call this week</h2>
              <p className="ov-block-note">
                Not a task list. You cannot have 400 conversations a year &mdash; Upline can, and
                these are the ones where the call should come from you.
              </p>
            </div>
          </div>

          <div className="ov-wk">
            {WORTH_KNOWING.map((w) => (
              <article key={w.id} className={`ov-wk-card is-${w.kind}`}>
                <p className="ov-wk-kind">
                  {WORTH_KNOWING_KINDS[w.kind].label}
                  <span>{WORTH_KNOWING_KINDS[w.kind].hint}</span>
                </p>
                <p className="ov-wk-name">
                  {w.name} <span>{w.lines}</span>
                </p>
                <p className="ov-wk-said">{w.said}</p>
                <p className="ov-wk-why">{w.why}</p>
                <p className="ov-wk-opener">
                  <span>Say this</span>
                  {w.opener}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* The funnel keeps its job as a graphic — it is the deck's picture of our
            process, which is a different thing from his book. */}
        <section className="ov-block ov-block-quiet" aria-label="How the outreach converts">
          <div className="ov-block-head">
            <div>
              <p className="ov-kicker">Under the hood</p>
              <h2>How the outreach converts</h2>
              <p className="ov-block-note">
                Rolling 90 days. This is the sales-deck picture &mdash; our process, not his book.
                It earns its keep in a pitch and in the 90-day check-in, so it sits at the bottom
                rather than the top.
              </p>
            </div>
          </div>
          <div className="ov-funnel">
            <OutreachFunnel stages={RANGE_VIEWS.quarter.funnel} />
          </div>
        </section>

        <p className="ov-foot">
          Coverage, the trail, and the {quiet.now.toLocaleString()} not-yet-reached all need the
          whole book loaded &mdash; the full renewal calendar and last-contact history, not just the
          weekly 30. That is the open scope question on this screen.
        </p>
      </div>
    </div>
  );
}
