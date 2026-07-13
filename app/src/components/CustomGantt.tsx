import { useCallback, useMemo, useRef, useState } from 'react';
import type { Initiative, InitiativeStatus } from '../types';
import { STATUS_COLORS } from '../utils/ganttTasks';
import {
  addDays,
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
  onDateChange: (id: string, start: string, end: string) => void;
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
}: CustomGanttProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);

  const dayWidth = DAY_WIDTH[viewMode];
  const { rangeStart, totalDays } = useMemo(() => computeRange(initiatives), [initiatives]);
  const weeks = useMemo(
    () => buildWeekColumns(rangeStart, addDays(rangeStart, totalDays - 1)),
    [rangeStart, totalDays],
  );
  const timelineWidth = totalDays * dayWidth;

  const groups = useMemo((): WorkstreamGroup[] => {
    const map = new Map<string, Initiative[]>();
    for (const item of initiatives) {
      const list = map.get(item.workstream) ?? [];
      list.push(item);
      map.set(item.workstream, list);
    }

    const orderedNames = [
      ...workstreamOrder,
      ...[...map.keys()].filter((name) => !workstreamOrder.includes(name)).sort(),
    ];

    return orderedNames.map((name) => {
      const items = map.get(name) ?? [];
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
  }, [initiatives, workstreamOrder, rangeStart, totalDays]);

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
        onDateChange(prev.id, formatDate(newStart), formatDate(newEnd));
        return null;
      });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    },
    [dayWidth, onDateChange, onPointerMove],
  );

  function startDrag(e: React.PointerEvent, initiative: Initiative) {
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

  if (initiatives.length === 0) {
    return <p className="empty">No initiatives match these filters.</p>;
  }

  return (
    <div className="custom-gantt">
      <div className="custom-gantt-scroll" ref={scrollRef}>
        <div className="custom-gantt-grid" style={{ width: 220 + timelineWidth }}>
          <div className="cg-row cg-header">
            <div className="cg-label-col" />
            <div className="cg-timeline" style={{ width: timelineWidth }}>
              {weeks.map((week) => (
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
                return (
                  <div key={initiative.id} className="cg-row cg-task-row">
                    <div className="cg-label-col" />
                    <div className="cg-timeline" style={{ width: timelineWidth }}>
                      <div
                        className={`cg-task-bar${isDragging ? ' dragging' : ''}`}
                        style={{
                          left: offsetLeft(renderStart),
                          width: barWidth(renderStart, renderEnd),
                          backgroundColor: color,
                        }}
                        onPointerDown={(e) => startDrag(e, initiative)}
                        title={`${initiative.title} (${initiative.start} → ${initiative.end})`}
                      />
                      <span
                        className="cg-task-label"
                        style={{
                          left: offsetLeft(renderStart) + barWidth(renderStart, renderEnd) + 8,
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
