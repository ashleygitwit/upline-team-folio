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
  const [statusFilter, setStatusFilter] = useState<InitiativeStatus | 'All'>('All');
  const [workstreamFilter, setWorkstreamFilter] = useState<string>('All');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/venture-plan.json')
      .then((res) => {
        if (!res.ok) throw new Error('Could not load venture plan');
        return res.json();
      })
      .then((data: VenturePlan) => setPlan(data))
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
        <div className="header-brand">
          <img src="/upline-logo.png" alt="Upline" className="logo" />
          <div>
            <p className="eyebrow">Venture Plan</p>
            <h1>Upline Gantt</h1>
          </div>
        </div>
        <p className="summary">{plan.summary}</p>
        <p className="meta">Last updated {plan.lastUpdated}</p>
      </header>

      <section className="filters">
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
          <select value={workstreamFilter} onChange={(e) => setWorkstreamFilter(e.target.value)}>
            <option value="All">All</option>
            {workstreams.map((workstream) => (
              <option key={workstream} value={workstream}>
                {workstream}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="legend">
        {STATUSES.map((status) => (
          <span key={status} className="legend-item">
            <span className="swatch" style={{ backgroundColor: STATUS_COLORS[status] }} />
            {status}
          </span>
        ))}
      </section>

      <section className="gantt-wrap">
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
                  <p>{initiative.workstream}</p>
                  <p>{initiative.status} · {initiative.owner}</p>
                  {initiative.notes ? <p>{initiative.notes}</p> : null}
                </div>
              );
            }}
          />
        )}
      </section>

      <section className="initiative-list">
        <h2>Initiatives ({filteredInitiatives.length})</h2>
        <ul>
          {filteredInitiatives.map((initiative) => (
            <li key={initiative.id}>
              <span
                className="status-dot"
                style={{ backgroundColor: STATUS_COLORS[initiative.status] }}
              />
              <div>
                <strong>{initiative.title}</strong>
                <p>
                  {initiative.workstream} · {initiative.owner} · {initiative.start} →{' '}
                  {initiative.end}
                </p>
                {initiative.notes ? <p className="notes">{initiative.notes}</p> : null}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
