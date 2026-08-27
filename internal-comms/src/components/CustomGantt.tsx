import { useCallback, useMemo, useRef, useState } from 'react';
import type { Initiative, InitiativeStatus } from '../types';
import { STATUS_COLORS } from '../utils/ganttTasks';
import {
  addDays,
  buildMonthColumns,
  buildWeekColumns,
  computeRange,
  daysBetween,
  formatDate,
  parseDate,
} from '../utils/ganttDates';
import './CustomGantt.css';

export type TimelineZoom = 'Day' | 'Week' | 'Month';

const DAY_WIDTH: Record<TimelineZoom, number> = {
  Day: 22,
  Week: 14,
  Month: 5,
};

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

interface CustomGanttProps {
  initiatives: Initiative[];
  workstreamOrder?: string[];
  viewMode: TimelineZoom;
  onDateChange?: (id: string, start: string, end: string) => void;
  /** Current-plan bars to draw grayed behind matching ids. */
  overlayById?: Record<string, Initiative>;
  showOverlay?: boolean;
  readOnly?: boolean;
  /** When set, these ids stay in this order at the top of their workstream. */
  rowOrder?: string[];
}

interface WorkstreamGroup {
  name: string;
  initiatives: Initiative[];
  phaseStart: Date;
  phaseEnd: Date;
}

type DragState = {
  id: string;
  startX: number;
  origStart: Date;
  origEnd: Date;
  duration: number;
  deltaDays: number;
};

export function CustomGantt({
  initiatives,
  workstreamOrder = [],
  viewMode,
  onDateChange,
  overlayById,
  showOverlay = false,
  readOnly = false,
  rowOrder = [],
}: CustomGanttProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const dayWidth = DAY_WIDTH[viewMode];
  const overlayOnlyIds = useMemo(() => {
    if (!showOverlay || !overlayById) return new Set<string>();
    const primary = new Set(initiatives.map((item) => item.id));
    return new Set(Object.keys(overlayById).filter((id) => !primary.has(id)));
  }, [initiatives, overlayById, showOverlay]);
  const displayInitiatives = useMemo(() => {
    if (!showOverlay || !overlayById || overlayOnlyIds.size === 0) return initiatives;
    const extras = Object.values(overlayById).filter((item) => overlayOnlyIds.has(item.id));
    return [...initiatives, ...extras];
  }, [initiatives, overlayById, overlayOnlyIds, showOverlay]);
  const rangeSource = useMemo(() => {
    if (!showOverlay || !overlayById) return displayInitiatives;
    return [...displayInitiatives, ...Object.values(overlayById)];
  }, [displayInitiatives, overlayById, showOverlay]);
  const { rangeStart, totalDays } = useMemo(() => computeRange(rangeSource), [rangeSource]);
  const weeks = useMemo(
    () => buildWeekColumns(rangeStart, totalDays),
    [rangeStart, totalDays],
  );
  const months = useMemo(
    () => buildMonthColumns(rangeStart, totalDays),
    [rangeStart, totalDays],
  );
  const timelineWidth = totalDays * dayWidth;

  const groups = useMemo((): WorkstreamGroup[] => {
    const map = new Map<string, Initiative[]>();
    for (const item of displayInitiatives) {
      const list = map.get(item.workstream) ?? [];
      list.push(item);
      map.set(item.workstream, list);
    }

    const orderedNames = [
      ...workstreamOrder,
      ...[...map.keys()].filter((name) => !workstreamOrder.includes(name)).sort(),
    ];

    return orderedNames.map((name) => {
      const items = [...(map.get(name) ?? [])].sort((a, b) => {
        const pinA = rowOrder.indexOf(a.id);
        const pinB = rowOrder.indexOf(b.id);
        const aPinned = pinA !== -1;
        const bPinned = pinB !== -1;
        if (aPinned || bPinned) {
          if (aPinned && bPinned) return pinA - pinB;
          return aPinned ? -1 : 1;
        }
        const startDelta = parseDate(a.start).getTime() - parseDate(b.start).getTime();
        if (startDelta !== 0) return startDelta;
        return parseDate(a.end).getTime() - parseDate(b.end).getTime();
      });
      if (items.length === 0) {
        return {
          name,
          initiatives: [],
          phaseStart: rangeStart,
          phaseEnd: addDays(rangeStart, totalDays - 1),
        };
      }
      const starts = items.map((i) => parseDate(i.start));
      const ends = items.map((i) => parseDate(i.end));
      return {
        name,
        initiatives: items,
        phaseStart: new Date(Math.min(...starts.map((d) => d.getTime()))),
        phaseEnd: new Date(Math.max(...ends.map((d) => d.getTime()))),
      };
    });
  }, [displayInitiatives, workstreamOrder, rangeStart, totalDays, rowOrder]);

  const offsetLeft = useCallback(
    (date: Date) => daysBetween(rangeStart, date) * dayWidth,
    [rangeStart, dayWidth],
  );

  const barWidth = useCallback(
    (start: Date, end: Date) => Math.max(dayWidth, (daysBetween(start, end) + 1) * dayWidth),
    [dayWidth],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      setDrag((prev) => {
        if (!prev) return prev;
        const deltaDays = Math.round((e.clientX - prev.startX) / dayWidth);
        return { ...prev, deltaDays };
      });
    },
    [dayWidth],
  );

  const onPointerUp = useCallback(
    (e: PointerEvent) => {
      setDrag((prev) => {
        if (!prev) return null;
        const deltaDays = Math.round((e.clientX - prev.startX) / dayWidth);
        const newStart = addDays(prev.origStart, deltaDays);
        const newEnd = addDays(newStart, prev.duration);
        onDateChange?.(prev.id, formatDate(newStart), formatDate(newEnd));
        return null;
      });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    },
    [dayWidth, onDateChange, onPointerMove],
  );

  function startDrag(e: React.PointerEvent, initiative: Initiative) {
    if (readOnly || !onDateChange) return;
    e.preventDefault();
    const origStart = parseDate(initiative.start);
    const origEnd = parseDate(initiative.end);
    setDrag({
      id: initiative.id,
      startX: e.clientX,
      origStart,
      origEnd,
      duration: daysBetween(origStart, origEnd),
      deltaDays: 0,
    });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  if (displayInitiatives.length === 0) {
    return <p className="empty">No initiatives match these filters.</p>;
  }

  return (
    <div className="custom-gantt">
      <div className="custom-gantt-scroll" ref={scrollRef}>
        <div className="custom-gantt-grid" style={{ width: 220 + timelineWidth }}>
          <div className="cg-row cg-header">
            <div className="cg-label-col" />
            <div className="cg-timeline" style={{ width: timelineWidth }}>
              {viewMode === 'Month'
                ? months.map((month) => (
                    <div
                      key={month.start.toISOString()}
                      className="cg-month"
                      style={{ width: month.days * dayWidth }}
                    >
                      <div className="cg-month-label">{month.label}</div>
                    </div>
                  ))
                : weeks.map((week) => (
                    <div
                      key={week.start.toISOString()}
                      className="cg-week"
                      style={{ width: 7 * dayWidth }}
                    >
                      <div className="cg-week-label">{week.label}</div>
                      <div className="cg-day-letters">
                        {DAY_LETTERS.map((letter, i) => (
                          <span key={i} style={{ width: dayWidth }}>
                            {letter}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.name} className="cg-phase-group">
              <div className="cg-row cg-phase-row">
                <div className="cg-label-col cg-phase-name">{group.name}</div>
                <div className="cg-timeline" style={{ width: timelineWidth }}>
                  {group.initiatives.length > 0 ? (
                    <div
                      className="cg-phase-bar"
                      style={{
                        left: offsetLeft(group.phaseStart),
                        width: barWidth(group.phaseStart, group.phaseEnd),
                      }}
                    />
                  ) : null}
                </div>
              </div>

              {group.initiatives.length === 0 && (
                <div className="cg-row cg-task-row cg-empty-row">
                  <div className="cg-label-col cg-empty-label">—</div>
                  <div className="cg-timeline" style={{ width: timelineWidth }} />
                </div>
              )}

              {group.initiatives.map((initiative) => {
                const overlayOnly = overlayOnlyIds.has(initiative.id);
                const overlay = showOverlay ? overlayById?.[initiative.id] : undefined;
                const isMilestone = Boolean(initiative.milestone || overlay?.milestone);
                const start = parseDate(initiative.start);
                const end = parseDate(initiative.end);
                const isDragging = drag?.id === initiative.id;
                const renderStart = isDragging
                  ? addDays(drag.origStart, drag.deltaDays)
                  : start;
                const renderEnd = isDragging
                  ? addDays(renderStart, drag.duration)
                  : end;
                const color = STATUS_COLORS[initiative.status as InitiativeStatus];
                const overlayMoved =
                  !overlayOnly &&
                  overlay &&
                  (overlay.start !== initiative.start || overlay.end !== initiative.end);
                const labelStart = overlayOnly && overlay ? parseDate(overlay.start) : renderStart;
                const labelEnd = overlayOnly && overlay ? parseDate(overlay.end) : renderEnd;
                const markLeft = (date: Date) => offsetLeft(date) + dayWidth / 2;
                return (
                  <div
                    key={initiative.id}
                    className={`cg-row cg-task-row${overlay ? ' has-overlay' : ''}${isMilestone ? ' is-milestone' : ''}`}
                  >
                    <div className="cg-label-col" />
                    <div className="cg-timeline" style={{ width: timelineWidth }}>
                      {isMilestone && overlay ? (
                        <div
                          className="cg-milestone cg-milestone-overlay"
                          style={{ left: markLeft(parseDate(overlay.start)) }}
                          title={`Current plan: ${overlay.title} (${overlay.start})`}
                        />
                      ) : null}
                      {isMilestone && !overlayOnly ? (
                        <div
                          className={`cg-milestone${isDragging ? ' dragging' : ''}${readOnly ? ' readonly' : ''}`}
                          style={{ left: markLeft(renderStart), backgroundColor: color }}
                          onPointerDown={(e) => startDrag(e, initiative)}
                          title={`${initiative.title} (${initiative.start})${
                            overlayMoved && overlay ? ` · current plan ${overlay.start}` : ''
                          }`}
                        />
                      ) : null}
                      {!isMilestone && overlay ? (
                        <div
                          className="cg-task-bar cg-task-bar-overlay"
                          style={{
                            left: offsetLeft(parseDate(overlay.start)),
                            width: barWidth(parseDate(overlay.start), parseDate(overlay.end)),
                          }}
                          title={`Current plan: ${overlay.title} (${overlay.start} → ${overlay.end})`}
                        />
                      ) : null}
                      {!isMilestone && !overlayOnly ? (
                        <div
                          className={`cg-task-bar${isDragging ? ' dragging' : ''}${readOnly ? ' readonly' : ''}`}
                          style={{
                            left: offsetLeft(renderStart),
                            width: barWidth(renderStart, renderEnd),
                            backgroundColor: color,
                          }}
                          onPointerDown={(e) => startDrag(e, initiative)}
                          title={`${initiative.title} (${initiative.start} → ${initiative.end})${
                            overlayMoved && overlay
                              ? ` · current plan ${overlay.start} → ${overlay.end}`
                              : ''
                          }`}
                        />
                      ) : null}
                      <span
                        className={`cg-task-label${isMilestone ? ' cg-milestone-label' : ''}`}
                        style={{
                          left: isMilestone
                            ? markLeft(labelStart) + 12
                            : offsetLeft(labelStart) + barWidth(labelStart, labelEnd) + 8,
                        }}
                      >
                        {initiative.title}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
