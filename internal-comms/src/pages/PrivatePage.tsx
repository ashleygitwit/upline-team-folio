import { useState, type FormEvent } from 'react';
import { ProductJourneyEmbed } from '../components/ProductJourneyEmbed';
import { CostBreakdown } from '../components/CostBreakdown';
import { PRIVATE_SECTIONS } from '../data/privateNotes';
import { PathToScalePage } from './PathToScalePage';

const STORAGE_KEY = 'throughline-private';
const PASSWORD = 'ashley';

function isUnlocked(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function PrivatePage() {
  const [unlocked, setUnlocked] = useState(isUnlocked);
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      setUnlocked(true);
      setError(false);
      return;
    }
    setError(true);
  }

  if (!unlocked) {
    return (
      <section className="hero">
        <p className="eyebrow">Private</p>
        <h1 className="hero-title">This page is locked.</h1>
        <form className="private-gate" onSubmit={onSubmit}>
          <label htmlFor="private-password">Password</label>
          <div className="private-gate-row">
            <input
              id="private-password"
              type="password"
              autoComplete="current-password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
            />
            <button type="submit">Open</button>
          </div>
          {error ? <p className="private-gate-error">That password doesn’t work.</p> : null}
        </form>
      </section>
    );
  }

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Private</p>
        <h1 className="hero-title">Ashley’s notes.</h1>
        <p className="hero-sub">
          Content pulled off the public site. One page, top to bottom.
        </p>
      </section>

      <section className="private-journey-block">
        <h2>Upline product journey — detailed</h2>
        <p className="sub-label">Moved from What is Upline</p>
        <ProductJourneyEmbed view="detail" />
      </section>

      <section className="card phase-card">
        <h2>Cost breakdown — what it costs to run the MVP</h2>
        <p className="sub-label">Moved from MVP</p>
        <CostBreakdown />
      </section>

      <PathToScalePage embedded />

      {PRIVATE_SECTIONS.length === 0 ? null : (
        PRIVATE_SECTIONS.map((section) => (
          <section key={section.id} className="card phase-card">
            <h2>{section.title}</h2>
            {section.from ? <p className="sub-label">{section.from}</p> : null}
            {section.paragraphs?.map((p) => (
              <p key={p} className="proof-statement" style={{ marginTop: '0.85rem' }}>
                {p}
              </p>
            ))}
            {section.bullets?.length ? (
              <ul className="proving-list">
                {section.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))
      )}
    </>
  );
}
