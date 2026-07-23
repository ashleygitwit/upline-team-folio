import { useCallback, useEffect, useState } from 'react';
import type { Learnings, VenturePlan } from './types';
import { HomePage } from './pages/HomePage';
import { LearningsPage } from './pages/LearningsPage';
import { RoadmapPage } from './pages/RoadmapPage';
import { PocPage } from './pages/PocPage';
import { SprintPage } from './pages/SprintPage';
import { MvpPage } from './pages/MvpPage';
import { BrandPage } from './pages/BrandPage';
import { TeamPage } from './pages/TeamPage';
import {
  clearPlanStorage,
  generateExportMarkdown,
  loadPlanFromStorage,
  savePlanToStorage,
} from './utils/planStorage';
import './App.css';

type RouteKey = 'home' | 'learnings' | 'roadmap' | 'poc' | 'sprint' | 'mvp' | 'brand' | 'team';

const NAV: { key: RouteKey; label: string; href: string }[] = [
  { key: 'home', label: 'What is Upline', href: '#/' },
  { key: 'learnings', label: 'Learnings', href: '#/learnings' },
  { key: 'roadmap', label: 'Roadmap', href: '#/roadmap' },
  { key: 'brand', label: 'Brand', href: '#/brand' },
  { key: 'team', label: 'Team', href: '#/team' },
];

// Roadmap detail pages highlight the Roadmap nav item.
const ROADMAP_ROUTES: RouteKey[] = ['roadmap', 'poc', 'sprint', 'mvp'];

// Sub-pages surfaced in the Roadmap nav dropdown.
const ROADMAP_MENU: { key: RouteKey; label: string; href: string }[] = [
  { key: 'roadmap', label: 'Roadmap overview', href: '#/roadmap' },
  { key: 'poc', label: 'Proof of Concept', href: '#/poc' },
  { key: 'sprint', label: 'Strategy Sprint', href: '#/sprint' },
  { key: 'mvp', label: 'MVP', href: '#/mvp' },
];

function routeFromHash(): RouteKey {
  const hash = window.location.hash.replace(/^#\/?/, '').split('/')[0];
  // Legacy link support: #/milestones now resolves to the Roadmap page.
  if (hash === 'milestones') return 'roadmap';
  if (
    hash === 'learnings' ||
    hash === 'roadmap' ||
    hash === 'poc' ||
    hash === 'sprint' ||
    hash === 'mvp' ||
    hash === 'brand' ||
    hash === 'team'
  ) {
    return hash;
  }
  return 'home';
}

function App() {
  const [plan, setPlan] = useState<VenturePlan | null>(null);
  const [learnings, setLearnings] = useState<Learnings | null>(null);
  const [exportMarkdown, setExportMarkdown] = useState('');
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteKey>(routeFromHash());

  const applyPlan = useCallback((next: VenturePlan, persist = true) => {
    setPlan(next);
    setExportMarkdown(generateExportMarkdown(next));
    if (persist) {
      savePlanToStorage(next);
      setHasLocalEdits(true);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    const stored = loadPlanFromStorage();
    if (stored) {
      setPlan(stored);
      setHasLocalEdits(true);
      setExportMarkdown(generateExportMarkdown(stored));
    } else {
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
    }

    fetch('/data/learnings.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load learnings');
        return res.json() as Promise<Learnings>;
      })
      .then(setLearnings)
      .catch(() => setLearnings(null));
  }, []);

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

  return (
    <div className="page">
      <header className="site-header">
        <a className="brand-lockup" href="#/" aria-label="The Upline Through Line — home">
          <img src="/upline-logo.png" alt="Upline" className="logo" />
          <span className="wordmark">The Through Line</span>
        </a>
        <nav className="site-nav" aria-label="Primary">
          {NAV.map((item) => {
            if (item.key === 'roadmap') {
              const isActive = ROADMAP_ROUTES.includes(route);
              return (
                <div key={item.key} className="nav-has-menu">
                  <a
                    href={item.href}
                    className={isActive ? 'nav-link active' : 'nav-link'}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                    <span className="nav-caret" aria-hidden="true">
                      ▾
                    </span>
                  </a>
                  <div className="nav-menu" role="menu">
                    {ROADMAP_MENU.map((sub) => (
                      <a
                        key={sub.key}
                        href={sub.href}
                        role="menuitem"
                        className={route === sub.key ? 'nav-menu-item active' : 'nav-menu-item'}
                        aria-current={route === sub.key ? 'page' : undefined}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            }
            const isActive = route === item.key;
            return (
              <a
                key={item.key}
                href={item.href}
                className={isActive ? 'nav-link active' : 'nav-link'}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </header>

      {error ? <p className="error">{error}</p> : null}

      {route === 'home' ? <HomePage plan={plan} /> : null}
      {route === 'learnings' ? <LearningsPage learnings={learnings} /> : null}
      {route === 'roadmap' ? (
        <RoadmapPage
          plan={plan}
          exportMarkdown={exportMarkdown}
          hasLocalEdits={hasLocalEdits}
          onPlanChange={applyPlan}
          onDownload={downloadPlanJson}
          onReset={resetToServerPlan}
        />
      ) : null}
      {route === 'poc' ? <PocPage plan={plan} /> : null}
      {route === 'sprint' ? <SprintPage /> : null}
      {route === 'mvp' ? <MvpPage /> : null}
      {route === 'brand' ? <BrandPage /> : null}
      {route === 'team' ? <TeamPage /> : null}

      <footer className="site-footer">
        <p>
          The Upline Through Line · Upline's home base. Present, learnings, and where we're headed —
          one roof.
        </p>
      </footer>
    </div>
  );
}

export default App;
