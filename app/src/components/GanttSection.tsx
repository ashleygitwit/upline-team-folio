import { useMemo, useState } from 'react';
import type { Initiative, InitiativeStatus, VenturePlan } from '../types';
import { STATUS_COLORS, touchPlan } from '../utils/ganttTasks';
import { newInitiativeId } from '../utils/planStorage';
import { CustomGantt, type TimelineZoom } from './CustomGantt';

const STATUSES: InitiativeStatus[] = ['In Flight', 'Next', 'Future', 'Done'];

type GanttView = 'timeline' | 'list';

interface GanttSectionProps {
  plan: VenturePlan;
  onPlanChange: (plan: VenturePlan) => void;
}

const emptyForm = {
  title: '',
  workstream: '',
  status: 'In Flight' as InitiativeStatus,
  owner: 'Ashley',
  start: new Date().toISOString().slice(0, 10),
  end: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  notes: '',
};

export function GanttSection({ plan, onPlanChange }: GanttSectionProps) {
  const [view, setView] = useState<GanttView>('timeline');
  const [viewMode, setViewMode] = useState<TimelineZoom>('Week');
  const [statusFilter, setStatusFilter] = useState<InitiativeStatus | 'All'>('All');
  const [workstreamFilter, setWorkstreamFilter] = useState<string>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const workstreams = useMemo(() => {
    const fromInitiatives = [...new Set(plan.initiatives.map((i) => i.workstream))];
    const order = plan.workstreams ?? [];
    return [
      ...order,
      ...fromInitiatives.filter((workstream) => !order.includes(workstream)).sort(),
    ];
  }, [plan.initiatives, plan.workstreams]);

  const ganttWorkstreamOrder = workstreamFilter === 'All' ? (plan.workstreams ?? []) : [];

  const filteredInitiatives = useMemo(
    () =>
      plan.initiatives.filter((initiative) => {
        const statusMatch = statusFilter === 'All' || initiative.status === statusFilter;
        const workstreamMatch =
          workstreamFilter === 'All' || initiative.workstream === workstreamFilter;
        return statusMatch && workstreamMatch;
      }),
    [plan.initiatives, statusFilter, workstreamFilter],
  );

  function updateInitiatives(next: Initiative[]) {
    onPlanChange(touchPlan({ ...plan, initiatives: next }));
  }

  function handleDateChange(id: string, start: string, end: string) {
    updateInitiatives(
      plan.initiatives.map((initiative) =>
        initiative.id === id ? { ...initiative, start, end } : initiative,
      ),
    );
  }

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    updateInitiatives(plan.initiatives.filter((i) => i.id !== id));
  }

  function handleAddInitiative(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.workstream.trim()) return;

    const initiative: Initiative = {
      id: newInitiativeId(form.title),
      title: form.title.trim(),
      workstream: form.workstream.trim(),
      status: form.status,
      owner: form.owner.trim() || 'Ashley',
      start: form.start,
      end: form.end,
      notes: form.notes.trim() || undefined,
    };

    updateInitiatives([...plan.initiatives, initiative]);
    setForm({ ...emptyForm, workstream: form.workstream });
    setShowAddForm(false);
  }

  return (
    <section className="card gantt-card">
      <div className="section-head">
        <h2>Plan</h2>
        <div className="toolbar">
          <div className="view-toggle" role="tablist" aria-label="Plan view">
            <button
              type="button"
              role="tab"
              aria-selected={view === 'timeline'}
              className={view === 'timeline' ? 'active' : ''}
              onClick={() => setView('timeline')}
            >
              Gantt chart
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === 'list'}
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              Table
            </button>
          </div>
          <button type="button" className="secondary-btn" onClick={() => setShowAddForm((v) => !v)}>
            {showAddForm ? 'Cancel' : '+ Add initiative'}
          </button>
        </div>
      </div>

      {showAddForm ? (
        <form className="add-form" onSubmit={handleAddInitiative}>
          <label>
            Title
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Initiative name"
            />
          </label>
          <label>
            Workstream
            <input
              required
              list="workstream-options"
              value={form.workstream}
              onChange={(e) => setForm({ ...form, workstream: e.target.value })}
              placeholder="e.g. GTM, POC / Pilot"
            />
            <datalist id="workstream-options">
              {workstreams.map((ws) => (
                <option key={ws} value={ws} />
              ))}
            </datalist>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as InitiativeStatus })}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Owner
            <input
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
            />
          </label>
          <label>
            Start
            <input
              type="date"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
            />
          </label>
          <label>
            End
            <input
              type="date"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
            />
          </label>
          <label className="full-width">
            Notes
            <input
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Optional"
            />
          </label>
          <button type="submit" className="copy-btn">
            Add to plan
          </button>
        </form>
      ) : null}

      <div className="filters-row">
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
        {view === 'timeline' ? (
          <label>
            Zoom
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as TimelineZoom)}
            >
              <option value="Day">Day</option>
              <option value="Week">Week</option>
              <option value="Month">Month</option>
            </select>
          </label>
        ) : null}
      </div>

      <div className="legend">
        {STATUSES.map((status) => (
          <span key={status} className="legend-item">
            <span className="swatch" style={{ backgroundColor: STATUS_COLORS[status] }} />
            {status}
          </span>
        ))}
      </div>

      <p className="edit-hint">
        Drag bars in Gantt chart view to reschedule. Use Table view to review details or delete items.
        Edits save in this browser — download plan JSON below to commit to the repo.
      </p>

      {view === 'timeline' ? (
        <CustomGantt
          initiatives={filteredInitiatives}
          workstreamOrder={ganttWorkstreamOrder}
          viewMode={viewMode}
          onDateChange={handleDateChange}
        />
      ) : (
        <div className="list-view">
          {filteredInitiatives.length === 0 ? (
            <p className="empty">No initiatives match these filters.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Initiative</th>
                  <th>Workstream</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Start</th>
                  <th>End</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredInitiatives.map((initiative) => (
                  <tr key={initiative.id}>
                    <td>
                      <strong>{initiative.title}</strong>
                      {initiative.notes ? <p className="row-notes">{initiative.notes}</p> : null}
                    </td>
                    <td>{initiative.workstream}</td>
                    <td>
                      <span
                        className="status-pill"
                        style={{ backgroundColor: STATUS_COLORS[initiative.status] }}
                      >
                        {initiative.status}
                      </span>
                    </td>
                    <td>{initiative.owner}</td>
                    <td>{initiative.start}</td>
                    <td>{initiative.end}</td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => handleDelete(initiative.id, initiative.title)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </section>
  );
}
