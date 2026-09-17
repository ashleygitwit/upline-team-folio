import { useCallback, useEffect, useState } from 'react';
import type { Learnings, VenturePlan } from './types';
import { HomePage } from './pages/HomePage';
import { LearningsPage } from './pages/LearningsPage';
import { GanttPage } from './pages/GanttPage';
import { PocPage } from './pages/PocPage';
import { SprintPage } from './pages/SprintPage';
import { MvpJourneyPage } from './pages/MvpJourneyPage';
import { MvpPage } from './pages/MvpPage';
import { OkrPage } from './pages/OkrPage';
import { GtmPage } from './pages/GtmPage';
import { PricingPage } from './pages/PricingPage';
import { BrandPage } from './pages/BrandPage';
import { TeamPage } from './pages/TeamPage';
import { PrivatePage } from './pages/PrivatePage';
import {
  clearPlanStorage,
  loadPlanFromStorage,
  savePlanToStorage,
} from './utils/planStorage';
import './App.css';

type RouteKey =
  | 'home'
  | 'learnings'
  | 'gantt'
  | 'poc'
  | 'sprint'
  | 'mvp-journey'
  | 'mvp'
  | 'okrs'
  | 'gtm'
  | 'pricing'
  | 'brand'
  | 'team'
  | 'private';

const NAV_SECTIONS: {
  id: 'context' | 'progress';
  label: string;
  items: { key: RouteKey; label: string; href: string }[];
}[] = [
  {
    id: 'context',
    label: 'Context',
    items: [
      { key: 'home', label: 'Overview', href: '#/' },
      { key: 'pricing', label: 'Pricing strategy', href: '#/pricing' },
      { key: 'learnings', label: 'Learnings', href: '#/learnings' },
      { key: 'poc', label: 'POC results', href: '#/poc' },
      { key: 'brand', label: 'Brand', href: '#/brand' },
      { key: 'team', label: 'Team', href: '#/team' },
    ],
  },
  {
    id: 'progress',
    label: 'Progress',
    items: [
      { key: 'gantt', label: 'Gantt chart', href: '#/gantt' },
      { key: 'sprint', label: 'Strategy sprint', href: '#/sprint' },
      { key: 'mvp', label: 'MVP definition', href: '#/mvp' },
      { key: 'okrs', label: 'OKRs', href: '#/okrs' },
      { key: 'gtm', label: 'GTM approach', href: '#/gtm' },
    ],
  },
];

function navKeyForRoute(route: RouteKey): RouteKey {
  if (route === 'mvp-journey') return 'mvp';
  return route;
}

function routeFromHash(): RouteKey {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const hash = parts[0] ?? '';
  const day = parts[1];
  // Legacy links: the roadmap overview is gone; the live plan is the Gantt.
  if (hash === 'milestones' || hash === 'scenario-build-now' || hash === 'roadmap') {
    if (window.location.hash !== '#/gantt') {
      window.location.replace(`${window.location.pathname}${window.location.search}#/gantt`);
    }
    return 'gantt';
  }
  // Owner view was a sprint-week wireframe; it is no longer a Through Line page.
  if (hash === 'owner-view') {
    if (window.location.hash !== '#/mvp') {
      window.location.replace(`${window.location.pathname}${window.location.search}#/mvp`);
    }
    return 'mvp';
  }
  // Path to Scale moved onto the private page.
  if (hash === 'scale') {
    if (window.location.hash !== '#/private') {
      window.location.replace(`${window.location.pathname}${window.location.search}#/private`);
    }
    return 'private';
  }
  // Per-day sprint pages were retired; the week lives on one page now.
  if (hash === 'sprint' && day) {
    if (window.location.hash !== '#/sprint') {
      window.location.replace(`${window.location.pathname}${window.location.search}#/sprint`);
    }
    return 'sprint';
  }
  if (
    hash === 'learnings' ||
    hash === 'gantt' ||
    hash === 'poc' ||
    hash === 'sprint' ||
    hash === 'mvp-journey' ||
    hash === 'mvp' ||
    hash === 'okrs' ||
    hash === 'gtm' ||
    hash === 'pricing' ||
    hash === 'brand' ||
    hash === 'team' ||
    hash === 'private'
  ) {
    return hash;
  }
  return 'home';
}

function App() {
  const [plan, setPlan] = useState<VenturePlan | null>(null);
  const [learnings, setLearnings] = useState<Learnings | null>(null);
  const [hasLocalEdits, setHasLocalEdits] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [route, setRoute] = useState<RouteKey>(routeFromHash());
  const [navOpen, setNavOpen] = useState(false);

  const applyPlan = useCallback((next: VenturePlan, persist = true) => {
    setPlan(next);
    if (persist) {
      savePlanToStorage(next);
      setHasLocalEdits(true);
    }
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(routeFromHash());
      setNavOpen(false);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);

  useEffect(() => {
    fetch('/data/venture-plan.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load venture plan');
        return res.json() as Promise<VenturePlan>;
      })
      .then((planData) => {
        const stored = loadPlanFromStorage();
        const storedIsCurrent = Boolean(
          stored &&
            typeof stored.lastUpdated === 'string' &&
            stored.lastUpdated >= planData.lastUpdated,
        );
        if (stored && storedIsCurrent) {
          setPlan(stored);
          setHasLocalEdits(true);
        } else {
          if (stored) clearPlanStorage();
          setPlan(planData);
          setHasLocalEdits(false);
        }
      })
      .catch((err: Error) => setError(err.message));

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

  const isGantt = route === 'gantt';
  const isWide = route === 'mvp-journey' || route === 'private' || isGantt;
  const pageClass = `page${isWide ? ' is-wide' : ''}${route === 'home' ? ' is-home' : ''}${isGantt ? ' is-gantt' : ''}`;
  const activeNav = navKeyForRoute(route);

  return (
    <div className={`app-shell${navOpen ? ' is-nav-open' : ''}${isGantt ? ' is-gantt-shell' : ''}`}>
      <button
        type="button"
        className="nav-backdrop"
        aria-label="Close navigation"
        tabIndex={navOpen ? 0 : -1}
        onClick={() => setNavOpen(false)}
      />

      <aside className="site-sidebar" id="site-sidebar">
        <a className="brand-lockup" href="#/" aria-label="The Upline Through Line — home">
          <img src="/upline-u.svg" alt="Upline" className="logo" />
          <span className="wordmark">The Through Line</span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {NAV_SECTIONS.map((section) => (
            <div key={section.id} className="nav-section">
              <p className="nav-section-kicker">{section.label}</p>
              {section.items.map((item) => {
                const isActive = activeNav === item.key;
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
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <a className="nav-link nav-link-quiet" href="#/private">
            Private
          </a>
        </div>
      </aside>

      <div className="app-main">
        <header className="site-topbar">
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="site-sidebar"
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="nav-toggle-bars" aria-hidden="true" />
            <span className="sr-only">{navOpen ? 'Close menu' : 'Open menu'}</span>
          </button>
          <a className="brand-lockup" href="#/" aria-label="The Upline Through Line — home">
            <img src="/upline-u.svg" alt="" className="logo" />
            <span className="wordmark">The Through Line</span>
          </a>
        </header>

        <div className={pageClass}>
          {error ? <p className="error">{error}</p> : null}

          {route === 'home' ? <HomePage plan={plan} /> : null}
          {route === 'learnings' ? <LearningsPage learnings={learnings} /> : null}
          {route === 'gantt' ? (
            <GanttPage
              plan={plan}
              hasLocalEdits={hasLocalEdits}
              onPlanChange={applyPlan}
              onDownload={downloadPlanJson}
              onReset={resetToServerPlan}
            />
          ) : null}
          {route === 'poc' ? <PocPage plan={plan} /> : null}
          {route === 'sprint' ? <SprintPage /> : null}
          {route === 'mvp-journey' ? <MvpJourneyPage /> : null}
          {route === 'mvp' ? <MvpPage /> : null}
          {route === 'okrs' ? <OkrPage /> : null}
          {route === 'gtm' ? <GtmPage /> : null}
          {route === 'pricing' ? <PricingPage /> : null}
          {route === 'brand' ? <BrandPage /> : null}
          {route === 'team' ? <TeamPage /> : null}
          {route === 'private' ? <PrivatePage /> : null}

          {isGantt ? null : (
            <footer className="site-footer">
              <p>
                The Upline Through Line · Upline&rsquo;s home base. Present, learnings, and where
                we&rsquo;re headed — one roof.{' '}
                <a className="site-footer-private" href="#/private">
                  Private
                </a>
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
