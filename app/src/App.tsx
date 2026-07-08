import { useEffect, useMemo, useState } from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import type { Task } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import type { InitiativeStatus, VenturePlan } from './types';
import './App.css';

const STATUS_COLORS: Record<InitiativeStatus, string> = {
  'In Flight': '#4338CA',
  Next: '#6366F1',
  Future: '#94A3B8',
  Done: '#16A34A',
};

const STATUSES: InitiativeStatus[] = ['In Flight', 'Next', 'Future', 'Done'];

function toTask(initiative: VenturePlan['initiatives'][number], index: number): Task {
  const start = new Date(initiative.start);
  const end = new Date(initiative.end);
  if (end <= start) {
    end.setDate(start.getDate() + 1);
  }

  return {
    id: initiative.id,
    name: initiative.title,
    type: 'task',
    start,
    end,
    progress: initiative.status === 'Done' ? 100 : initiative.status === 'In Flight' ? 55 : 15,
    project: initiative.workstream,
    styles: {
      backgroundColor: STATUS_COLORS[initiative.status],
      backgroundSelectedColor: STATUS_COLORS[initiative.status],
      progressColor: '#312E81',
      progressSelectedColor: '#312E81',
    },
    displayOrder: index,
  };
}

function App() {
  const [plan, setPlan] = useState<VenturePlan | null>(null);
  const [exportMarkdown, setExportMarkdown] = useState('');
  const [statusFilter, setStatusFilter] = useState<InitiativeStatus | 'All'>('All');
  const [workstreamFilter, setWorkstreamFilter] = useState<string>('All');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/data/venture-plan.json').then((res) => {
        if (!res.ok) throw new Error('Could not load venture plan');
        return res.json() as Promise<VenturePlan>;
      }),
      fetch('/venture/planning/execution-plan.md').then((res) => {
        if (!res.ok) throw new Error('Could not load execution plan export');
        return res.text();
      }),
    ])
      .then(([planData, markdown]) => {
        setPlan(planData);
        setExportMarkdown(markdown);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  const workstreams = useMemo(() => {
    if (!plan) return [];
    return [...new Set(plan.initiatives.map((i) => i.workstream))].sort();
  }, [plan]);

  const filteredInitiatives = useMemo(() => {
    if (!plan) return [];
    return plan.initiatives.filter((initiative) => {
      const statusMatch = statusFilter === 'All' || initiative.status === statusFilter;
      const workstreamMatch =
        workstreamFilter === 'All' || initiative.workstream === workstreamFilter;
      return statusMatch && workstreamMatch;
    });
  }, [plan, statusFilter, workstreamFilter]);

  const tasks = useMemo(
    () => filteredInitiatives.map((initiative, index) => toTask(initiative, index)),
    [filteredInitiatives],
  );

  async function copyExport() {
    await navigator.clipboard.writeText(exportMarkdown);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
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
      </header>

      <section className="card thesis-card">
        <h2>Venture thesis</h2>
        <p>{plan.venture.thesis}</p>
      </section>

      <section className="card mantra-card">
        <h2>Mantra</h2>
        <blockquote>{plan.venture.mantra}</blockquote>
      </section>

      <section className="card proof-card">
        <h2>Upcoming proof point</h2>
        <p>{plan.venture.upcomingProofPoint}</p>
      </section>

      <section className="card gantt-card">
        <div className="section-head">
          <h2>Gantt</h2>
          <div className="filters">
            <label>
              Status
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as InitiativeStatus | 'All')}
              >
                <option value="All">All</option>
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Workstream
              <select
                value={workstreamFilter}
                onChange={(e) => setWorkstreamFilter(e.target.value)}
              >
                <option value="All">All</option>
                {workstreams.map((workstream) => (
                  <option key={workstream} value={workstream}>
                    {workstream}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="legend">
          {STATUSES.map((status) => (
            <span key={status} className="legend-item">
              <span className="swatch" style={{ backgroundColor: STATUS_COLORS[status] }} />
              {status}
            </span>
          ))}
        </div>

        <div className="gantt-wrap">
          {tasks.length === 0 ? (
            <p className="empty">No initiatives match these filters.</p>
          ) : (
            <Gantt
              tasks={tasks}
              viewMode={ViewMode.Month}
              listCellWidth="280px"
              columnWidth={56}
              rowHeight={44}
              barFill={62}
              TooltipContent={({ task }) => {
                const initiative = filteredInitiatives.find((i) => i.id === task.id);
                if (!initiative) return null;
                return (
                  <div className="tooltip">
                    <strong>{initiative.title}</strong>
                    <p>
                      {initiative.workstream} · {initiative.status} · {initiative.owner}
                    </p>
                    {initiative.notes ? <p>{initiative.notes}</p> : null}
                  </div>
                );
              }}
            />
          )}
        </div>
      </section>

      <section className="card export-card">
        <div className="section-head">
          <div>
            <h2>Copy for your LLM</h2>
            <p className="export-hint">
              Paste into ChatGPT, Claude, or your preferred chat tool to ask about timeline,
              priorities, and what is in flight.
            </p>
          </div>
          <button type="button" className="copy-btn" onClick={copyExport}>
            {copied ? 'Copied!' : 'Copy execution-plan.md'}
          </button>
        </div>
        <pre className="export-box">{exportMarkdown}</pre>
      </section>
    </div>
  );
}

export default App;
