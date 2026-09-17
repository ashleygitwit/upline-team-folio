import { useMemo, useState } from 'react';
import type { Initiative, InitiativeStatus, VenturePlan } from '../types';
import {
  ownerIncludesPerson,
  STATUS_COLORS,
  touchPlan,
  uniquePeople,
} from '../utils/ganttTasks';
import { newInitiativeId } from '../utils/planStorage';
import { CustomGantt, type TimelineZoom } from './CustomGantt';

const STATUSES: InitiativeStatus[] = ['In Flight', 'Next', 'Future', 'Done'];
const ZOOMS: TimelineZoom[] = ['Day', 'Week', 'Month', 'Quarter'];

interface GanttSectionProps {
  plan: VenturePlan;
  onPlanChange: (plan: VenturePlan) => void;
  layout?: 'embed' | 'full';
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

export function GanttSection({ plan, onPlanChange, layout = 'embed' }: GanttSectionProps) {
  const [viewMode, setViewMode] = useState<TimelineZoom>('Week');
  const [statusFilter, setStatusFilter] = useState<InitiativeStatus | 'All'>('All');
  const [workstreamFilter, setWorkstreamFilter] = useState<string>('All');
  const [personFilter, setPersonFilter] = useState<string>('Everyone');
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [todayTick, setTodayTick] = useState(0);

  const workstreams = useMemo(() => {
    const fromInitiatives = [...new Set(plan.initiatives.map((i) => i.workstream))];
    const order = plan.workstreams ?? [];
    return [
      ...order,
      ...fromInitiatives.filter((workstream) => !order.includes(workstream)).sort(),
    ];
  }, [plan.initiatives, plan.workstreams]);

  const people = useMemo(() => uniquePeople(plan.initiatives), [plan.initiatives]);

  const ganttWorkstreamOrder = workstreamFilter === 'All' ? (plan.workstreams ?? []) : [];

  const filteredInitiatives = useMemo(() => {
    const matches = (initiative: Initiative) => {
      const statusMatch = statusFilter === 'All' || initiative.status === statusFilter;
      const workstreamMatch =
        workstreamFilter === 'All' || initiative.workstream === workstreamFilter;
      const personMatch =
        personFilter === 'Everyone' || ownerIncludesPerson(initiative.owner, personFilter);
      return statusMatch && workstreamMatch && personMatch;
    };
    const keep = new Set<string>();
    for (const initiative of plan.initiatives) {
      if (!matches(initiative)) continue;
      keep.add(initiative.id);
      if (initiative.parentId) keep.add(initiative.parentId);
    }
    return plan.initiatives.filter((initiative) => keep.has(initiative.id));
  }, [plan.initiatives, statusFilter, workstreamFilter, personFilter]);

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
    <section className={layout === 'full' ? 'card gantt-card is-full' : 'card gantt-card'}>
      <div className="section-head gantt-toolbar-head">
        {layout === 'embed' ? <h2>Current Plan</h2> : <h2 className="gantt-toolbar-title">Gantt</h2>}
        <div className="toolbar">
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
              placeholder="e.g. GTM, Product"
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

      <div className="gantt-controls">
        <div className="view-toggle zoom-toggle" role="radiogroup" aria-label="Timeline zoom">
          {ZOOMS.map((zoom) => (
            <button
              key={zoom}
              type="button"
              role="radio"
              aria-checked={viewMode === zoom}
              className={viewMode === zoom ? 'active' : ''}
              onClick={() => setViewMode(zoom)}
            >
              {zoom}
            </button>
          ))}
        </div>
        <button type="button" className="secondary-btn" onClick={() => setTodayTick((n) => n + 1)}>
          Today
        </button>
        <label>
          Person
          <select value={personFilter} onChange={(e) => setPersonFilter(e.target.value)}>
            <option value="Everyone">Everyone</option>
            {people.map((person) => (
              <option key={person} value={person}>
                {person}
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
      </div>

      <div className="legend">
        {STATUSES.map((status) => (
          <span key={status} className="legend-item">
            <span className="swatch" style={{ backgroundColor: STATUS_COLORS[status] }} />
            {status}
          </span>
        ))}
        <span className="legend-item">
          <span className="swatch swatch-diamond" />
          Milestone
        </span>
      </div>

      {layout === 'embed' ? (
        <p className="edit-hint">
          Drag bars to reschedule. Edits save in this browser — download plan JSON below to commit
          to the repo.
        </p>
      ) : (
        <p className="edit-hint">
          Drag bars to reschedule. Filter by person or workstream. Edits save in this browser.
        </p>
      )}

      <CustomGantt
        initiatives={filteredInitiatives}
        workstreamOrder={ganttWorkstreamOrder}
        viewMode={viewMode}
        onDateChange={handleDateChange}
        fill={layout === 'full'}
        scrollToToday={todayTick}
      />
    </section>
  );
}
