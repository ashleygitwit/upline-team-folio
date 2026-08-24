import { useState } from 'react';
import {
  BUILD_NOW_INITIATIVES,
  BUILD_NOW_OVERLAY,
  BUILD_NOW_SCENARIO,
} from '../data/simulatedScenarios';
import { CustomGantt, type TimelineZoom } from './CustomGantt';

interface ScenarioGanttSectionProps {
  compact?: boolean;
  showStats?: boolean;
  heading?: string;
}

export function ScenarioGanttSection({
  compact = false,
  showStats = true,
  heading = 'Simulated Scenarios',
}: ScenarioGanttSectionProps) {
  const [layerCurrent, setLayerCurrent] = useState(true);
  const [viewMode, setViewMode] = useState<TimelineZoom>('Month');

  return (
    <section className="card gantt-card scenario-card">
      <div className="section-head">
        <div>
          <h2>{heading}</h2>
          <p className="scenario-kicker">{BUILD_NOW_SCENARIO.title}</p>
        </div>
        <label className="overlay-toggle">
          <input
            type="checkbox"
            checked={layerCurrent}
            onChange={(e) => setLayerCurrent(e.target.checked)}
          />
          Layer current plan
        </label>
      </div>

      <p className="edit-hint">{BUILD_NOW_SCENARIO.assumption}</p>

      {showStats ? (
        <div className="scenario-launch-row">
          <div className="scenario-launch-stat">
            <p className="tile-label">Launch in this scenario</p>
            <p className="scenario-launch-value">{BUILD_NOW_SCENARIO.launchLabel}</p>
          </div>
          <div className="scenario-launch-stat">
            <p className="tile-label">Current plan launch</p>
            <p className="scenario-launch-value is-muted">Dec 4, 2026</p>
          </div>
          <div className="scenario-launch-stat">
            <p className="tile-label">Pulled forward</p>
            <p className="scenario-launch-value">
              {BUILD_NOW_SCENARIO.weeksPulledForward} weeks
            </p>
          </div>
        </div>
      ) : null}

      <div className="filters-row">
        <label>
          Zoom
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as TimelineZoom)}
          >
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
        </label>
      </div>

      <div className="legend">
        <span className="legend-item">
          <span className="swatch scenario-swatch" />
          This scenario
        </span>
        <span className="legend-item">
          <span className="swatch overlay-swatch" />
          Current plan (layered)
        </span>
      </div>

      <p className="edit-hint">
        Gray bars are the published sequential plan. Color bars are the next-week start.
        Toggle the layer off to see only this scenario.
      </p>

      <CustomGantt
        initiatives={BUILD_NOW_INITIATIVES}
        workstreamOrder={['Product']}
        viewMode={viewMode}
        overlayById={BUILD_NOW_OVERLAY}
        showOverlay={layerCurrent}
        readOnly
        rowOrder={[
          'prod-sprint-prep',
          'prod-strategy-sprint',
          'prod-mvp-planning',
          'prod-mvp-build',
          'prod-mvp-launch',
          'prod-stockton-hill',
          'prod-pilot-retro',
        ]}
      />

      {compact ? (
        <a className="scale-cta" href={BUILD_NOW_SCENARIO.href}>
          <div>
            <p className="scale-cta-eyebrow">Scenario overview</p>
            <p className="scale-cta-title">{BUILD_NOW_SCENARIO.title}</p>
            <p className="scale-cta-sub">
              Assumption, what moves, and what has to be true to land{' '}
              {BUILD_NOW_SCENARIO.launchLabel}.
            </p>
          </div>
          <span className="scale-cta-arrow" aria-hidden="true">
            &rarr;
          </span>
        </a>
      ) : null}
    </section>
  );
}
