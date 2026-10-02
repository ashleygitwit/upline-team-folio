import { GanttSection } from '../components/GanttSection';
import type { VenturePlan } from '../types';
import { formatWeekRange } from '../utils/ganttDates';

interface GanttPageProps {
  plan: VenturePlan | null;
  hasLocalEdits: boolean;
  onPlanChange: (plan: VenturePlan) => void;
  onDownload: () => void;
  onReset: () => void;
}

export function GanttPage({
  plan,
  hasLocalEdits,
  onPlanChange,
  onDownload,
  onReset,
}: GanttPageProps) {
  return (
    <div className="gantt-page">
      <section className="gantt-page-head">
        <p className="eyebrow">Progress</p>
        <h1 className="hero-title">The 90-day plan</h1>
        <p className="hero-sub">
          This week · {formatWeekRange()}. Day shows seven days, week shows four weeks, month shows
          three months, quarter shows a year. Diamonds mark milestones; the vertical line marks
          today.
        </p>
      </section>

      {hasLocalEdits ? (
        <p className="local-edits-banner">
          You have unsaved browser edits to the plan.{' '}
          <button type="button" className="secondary-btn" onClick={onDownload}>
            Download JSON
          </button>{' '}
          <button type="button" className="secondary-btn" onClick={onReset}>
            Reset to deployed
          </button>
        </p>
      ) : null}

      {plan ? (
        <GanttSection plan={plan} onPlanChange={onPlanChange} layout="full" />
      ) : (
        <p className="loading">Loading plan…</p>
      )}
    </div>
  );
}
