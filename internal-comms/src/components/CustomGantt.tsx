import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Initiative, InitiativeStatus } from '../types';
import { splitOwners, STATUS_COLORS } from '../utils/ganttTasks';
import {
  addDays,
  buildMonthColumns,
  buildQuarterColumns,
  buildWeekColumns,
  clipToWindow,
  computeViewWindow,
  daysBetween,
  formatDate,
  parseDate,
  startOfToday,
  type TimelineZoom,
} from '../utils/ganttDates';
import './CustomGantt.css';

export type { TimelineZoom };

const LABEL_WIDTH = 300;
const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MIN_DAY_WIDTH: Record<TimelineZoom, number> = {
  Day: 48,
  Week: 22,
  Month: 8,
  Quarter: 3.2,
};

interface CustomGanttProps {
  initiatives: Initiative[];
  workstreamOrder?: string[];
  viewMode: TimelineZoom;
  onDateChange?: (id: string, start: string, end: string) => void;
  overlayById?: Record<string, Initiative>;
  showOverlay?: boolean;
  readOnly?: boolean;
  rowOrder?: string[];
  fill?: boolean;
  scrollToToday?: number;
}

interface WorkstreamGroup {
  name: string;
  parents: Initiative[];
}

type DragState = {
  id: string;
  startX: number;
  origStart: Date;
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
  fill = false,
  scrollToToday = 0,
}: CustomGanttProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [availWidth, setAvailWidth] = useState(960);
  const [expanded, setExpanded] = useState<Set<string> | null>(null);

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

  const childrenByParent = useMemo(() => {
    const map = new Map<string, Initiative[]>();
    for (const item of displayInitiatives) {
      if (!item.parentId) continue;
      const list = map.get(item.parentId) ?? [];
      list.push(item);
      map.set(item.parentId, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => parseDate(a.start).getTime() - parseDate(b.start).getTime());
    }
    return map;
  }, [displayInitiatives]);

  const autoExpanded = useMemo(() => {
    const ids = new Set<string>();
    for (const item of displayInitiatives) {
      if (item.parentId) continue;
      if (!childrenByParent.has(item.id)) continue;
      if (item.status === 'Done') continue;
      ids.add(item.id);
    }
    return ids;
  }, [displayInitiatives, childrenByParent]);
  const openIds = expanded ?? autoExpanded;

  const { rangeStart, totalDays } = useMemo(
    () => computeViewWindow(viewMode),
    [viewMode],
  );
  const dayWidth = Math.max(MIN_DAY_WIDTH[viewMode], (availWidth - LABEL_WIDTH) / totalDays);
  const weeks = useMemo(() => buildWeekColumns(rangeStart, totalDays), [rangeStart, totalDays]);
  const months = useMemo(() => buildMonthColumns(rangeStart, totalDays), [rangeStart, totalDays]);
  const quarters = useMemo(
    () => buildQuarterColumns(rangeStart, totalDays),
    [rangeStart, totalDays],
  );
  const timelineWidth = totalDays * dayWidth;
  const today = useMemo(() => startOfToday(), []);
  const todayOffset = daysBetween(rangeStart, today);
  const todayInRange = todayOffset >= 0 && todayOffset < totalDays;
  const todayLeft = LABEL_WIDTH + todayOffset * dayWidth + dayWidth / 2;

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
    ].filter((name) => (map.get(name) ?? []).length > 0);

    return orderedNames
      .map((name) => {
        const items = map.get(name) ?? [];
        const byId = new Map(items.map((item) => [item.id, item]));
        const overlaps = (item: Initiative) =>
          Boolean(clipToWindow(parseDate(item.start), parseDate(item.end), rangeStart, totalDays));
        const parents = items
          .filter((item) => {
            if (item.parentId) {
              return !byId.has(item.parentId);
            }
            const kids = childrenByParent.get(item.id) ?? [];
            if (kids.length > 0) return kids.some(overlaps) || overlaps(item);
            return overlaps(item);
          })
          .sort((a, b) => {
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
        return { name, parents };
      })
      .filter((group) => group.parents.length > 0);
  }, [displayInitiatives, workstreamOrder, rowOrder]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const measure = () => setAvailWidth(Math.max(LABEL_WIDTH + 120, el.clientWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !todayInRange) return;
    const jump = () => {
      if (el.scrollWidth <= el.clientWidth + 2) {
        el.scrollLeft = 0;
        return;
      }
      const target = Math.max(0, todayLeft - LABEL_WIDTH - el.clientWidth * 0.28);
      el.scrollLeft = target;
    };
    const frame = window.requestAnimationFrame(jump);
    return () => window.cancelAnimationFrame(frame);
  }, [scrollToToday, viewMode, todayInRange, todayLeft]);

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
    (_event: PointerEvent) => {
      setDrag((prev) => {
        if (!prev) return null;
        const newStart = addDays(prev.origStart, prev.deltaDays);
        const newEnd = addDays(newStart, prev.duration);
        onDateChange?.(prev.id, formatDate(newStart), formatDate(newEnd));
        return null;
      });
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    },
    [onDateChange, onPointerMove],
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
      duration: daysBetween(origStart, origEnd),
      deltaDays: 0,
    });
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  }

  function toggleParent(id: string) {
    const current = openIds;
    const next = new Set(current);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  }

  function renderBar(initiative: Initiative) {
    const overlayOnly = overlayOnlyIds.has(initiative.id);
    const overlay = showOverlay ? overlayById?.[initiative.id] : undefined;
    const isMilestone = Boolean(initiative.milestone || overlay?.milestone);
    const start = parseDate(initiative.start);
    const end = parseDate(initiative.end);
    const isDragging = drag?.id === initiative.id;
    const renderStart = isDragging ? addDays(drag.origStart, drag.deltaDays) : start;
    const renderEnd = isDragging ? addDays(renderStart, drag.duration) : end;
    const clipped = clipToWindow(renderStart, renderEnd, rangeStart, totalDays);
    const color = STATUS_COLORS[initiative.status as InitiativeStatus];
    const overlayMoved =
      !overlayOnly &&
      overlay &&
      (overlay.start !== initiative.start || overlay.end !== initiative.end);
    const markLeft = (date: Date) => offsetLeft(date) + dayWidth / 2;
    const people = splitOwners(initiative.owner);

    return (
      <div className="cg-timeline" style={{ width: timelineWidth }}>
        {isMilestone && overlay ? (
          <div
            className="cg-milestone cg-milestone-overlay"
            style={{ left: markLeft(parseDate(overlay.start)) }}
            title={`Current plan: ${overlay.title} (${overlay.start})`}
          />
        ) : null}
        {isMilestone && !overlayOnly && clipped ? (
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
        {!isMilestone && !overlayOnly && clipped ? (
          <>
            <div
              className={`cg-task-bar${isDragging ? ' dragging' : ''}${readOnly ? ' readonly' : ''}`}
              style={{
                left: offsetLeft(clipped.start),
                width: barWidth(clipped.start, clipped.end),
                backgroundColor: color,
              }}
              onPointerDown={(e) => startDrag(e, initiative)}
              title={`${initiative.title} (${initiative.start} → ${initiative.end})${
                overlayMoved && overlay ? ` · current plan ${overlay.start} → ${overlay.end}` : ''
              }`}
            />
            <span
              className="cg-bar-owner"
              style={{ left: offsetLeft(clipped.start) + barWidth(clipped.start, clipped.end) + 8 }}
            >
              {people.join(', ')}
            </span>
          </>
        ) : null}
      </div>
    );
  }

  function renderRow(initiative: Initiative, nested: boolean) {
    const kids = childrenByParent.get(initiative.id) ?? [];
    const hasKids = kids.length > 0;
    const isOpen = hasKids && openIds.has(initiative.id);
    const overlay = showOverlay ? overlayById?.[initiative.id] : undefined;
    const isMilestone = Boolean(initiative.milestone || overlay?.milestone);
    const people = splitOwners(initiative.owner);

    return (
      <div key={initiative.id}>
        <div
          className={`cg-row cg-task-row${overlay ? ' has-overlay' : ''}${isMilestone ? ' is-milestone' : ''}${nested ? ' is-nested' : ''}`}
        >
          <div className="cg-label-col">
            <div className="cg-task-meta">
              <span className="cg-task-name" title={initiative.title}>
                {hasKids ? (
                  <button
                    type="button"
                    className={`cg-accordion${isOpen ? ' is-open' : ''}`}
                    aria-expanded={isOpen}
                    onClick={() => toggleParent(initiative.id)}
                  >
                    <span className="cg-accordion-chevron" aria-hidden="true" />
                    {initiative.title}
                  </button>
                ) : (
                  initiative.title
                )}
              </span>
              <span className="cg-task-tags">
                {people.map((person) => (
                  <span key={person} className="cg-person" title={person}>
                    {person}
                  </span>
                ))}
              </span>
            </div>
          </div>
          {hasKids && isOpen ? (
            <div className="cg-timeline" style={{ width: timelineWidth }} />
          ) : (
            renderBar(initiative)
          )}
        </div>
        {hasKids && isOpen
          ? kids
              .filter((child) =>
                Boolean(
                  clipToWindow(parseDate(child.start), parseDate(child.end), rangeStart, totalDays),
                ),
              )
              .map((child) => renderRow(child, true))
          : null}
      </div>
    );
  }

  if (displayInitiatives.length === 0) {
    return <p className="empty">No initiatives match these filters.</p>;
  }

  const periodCols =
    viewMode === 'Quarter' ? quarters : viewMode === 'Month' ? months : null;
  const showDayLetters = viewMode === 'Day' || viewMode === 'Week';

  return (
    <div className={fill ? 'custom-gantt is-fill' : 'custom-gantt'}>
      <div className="custom-gantt-scroll" ref={scrollRef}>
        <div className="custom-gantt-grid" style={{ width: LABEL_WIDTH + timelineWidth }}>
          {todayInRange ? (
            <div className="cg-today-line" style={{ left: todayLeft }} title="Today" />
          ) : null}
          <div className="cg-row cg-header">
            <div className="cg-label-col cg-label-head">Initiative</div>
            <div className="cg-timeline" style={{ width: timelineWidth }}>
              {periodCols
                ? periodCols.map((col) => (
                    <div
                      key={col.start.toISOString()}
                      className="cg-month"
                      style={{ width: col.days * dayWidth }}
                    >
                      <div className="cg-month-label">{col.label}</div>
                    </div>
                  ))
                : weeks.map((week) => (
                    <div
                      key={week.start.toISOString()}
                      className="cg-week"
                      style={{ width: 7 * dayWidth }}
                    >
                      <div className="cg-week-label">{week.label}</div>
                      {showDayLetters ? (
                        <div className="cg-day-letters">
                          {DAY_LETTERS.map((letter, i) => {
                            const cellDate = addDays(week.start, i);
                            const isToday = daysBetween(cellDate, today) === 0;
                            return (
                              <span
                                key={i}
                                className={isToday ? 'is-today' : undefined}
                                style={{ width: dayWidth }}
                              >
                                {viewMode === 'Day' ? cellDate.getDate() : letter}
                              </span>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>
                  ))}
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.name} className="cg-phase-group">
              <div className="cg-row cg-phase-row">
                <div className="cg-label-col cg-phase-name">{group.name}</div>
                <div className="cg-timeline" style={{ width: timelineWidth }} />
              </div>
              {group.parents.map((initiative) => renderRow(initiative, false))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
