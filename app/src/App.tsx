import { useCallback, useEffect, useState } from 'react';
import type { VenturePlan } from './types';
import { GanttSection } from './components/GanttSection';
import {
  clearPlanStorage,
  generateExportMarkdown,
  loadPlanFromStorage,
  savePlanToStorage,
} from './utils/planStorage';
import './App.css';

function App() {
  const [plan, setPlan] = useState<VenturePlan | null>(null);
  const [exportMarkdown, setExportMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyPlan = useCallback((next: VenturePlan, persist = true) => {
    setPlan(next);
    setExportMarkdown(generateExportMarkdown(next));
    if (persist) {
      savePlanToStorage(next);
      setHasLocalEdits(true);
    }
  }, []);

  useEffect(() => {
    const stored = loadPlanFromStorage();
    if (stored) {
      setPlan(stored);
      setHasLocalEdits(true);
      setExportMarkdown(generateExportMarkdown(stored));
      return;
    }

    fetch('/data/venture-plan.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load venture plan');
        return res.json() as Promise<VenturePlan>;
      })
      .then((planData) => {
        setPlan(planData);
        setExportMarkdown(generateExportMarkdown(planData));
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  async function copyExport() {
    await navigator.clipboard.writeText(exportMarkdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function downloadPlanJson() {
    if (!plan) return;
    const blob = new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'venture-plan.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function resetToServerPlan() {
    if (
      !window.confirm(
        'Reset to the deployed plan? This clears browser edits and reloads from the server.',
      )
    ) {
      return;
    }
    clearPlanStorage();
    window.location.reload();
  }

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="page">
        <p className="loading">Loading venture plan…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="header">
        <img src="/upline-logo.png" alt="Upline" className="logo" />
        <p className="eyebrow">Venture Plan</p>
        <p className="meta">Last updated {plan.lastUpdated}</p>
        {hasLocalEdits ? (
          <p className="local-edits-banner">
            You have unsaved browser edits. Download JSON and ask the agent to commit, or reset to
            the deployed version.
          </p>
        ) : null}
      </header>

      <section className="card hypothesis-card">
        <h2>Venture hypothesis</h2>
        <p>{plan.venture.hypothesis}</p>
      </section>

      <section className="card thesis-card">
        <h2>Venture thesis</h2>
        <dl className="thesis-grid">
          <div>
            <dt>Problem</dt>
            <dd>{plan.venture.thesis.problem}</dd>
          </div>
          <div>
            <dt>World after</dt>
            <dd>{plan.venture.thesis.worldAfter}</dd>
          </div>
          <div>
            <dt>Our approach</dt>
            <dd>{plan.venture.thesis.approach}</dd>
          </div>
        </dl>
      </section>

      <section className="card mantra-card">
        <h2>Mantra</h2>
        <blockquote>{plan.venture.mantra}</blockquote>
      </section>

      <section className="card proof-card">
        <h2>Upcoming proof point</h2>
        <p>{plan.venture.upcomingProofPoint.description}</p>
        <p className="proof-success">
          <strong>Success:</strong>{' '}
          {plan.venture.upcomingProofPoint.successCriteria.join(' · ')}
        </p>
      </section>

      <GanttSection plan={plan} onPlanChange={applyPlan} />

      <section className="card export-card">
        <div className="section-head">
          <div>
            <h2>Copy for your LLM</h2>
            <p className="export-hint">
              Paste into ChatGPT, Claude, or your preferred chat tool to ask about timeline,
              priorities, and what is in flight. Export is team-framed — no individual
              assignments or meeting attributions.
            </p>
          </div>
          <div className="export-actions">
            <button type="button" className="secondary-btn" onClick={downloadPlanJson}>
              Download plan JSON
            </button>
            {hasLocalEdits ? (
              <button type="button" className="secondary-btn" onClick={resetToServerPlan}>
                Reset to deployed
              </button>
            ) : null}
            <button type="button" className="copy-btn" onClick={copyExport}>
              {copied ? 'Copied!' : 'Copy execution-plan.md'}
            </button>
          </div>
        </div>
        <pre className="export-box">{exportMarkdown}</pre>
      </section>
    </div>
  );
}

export default App;
