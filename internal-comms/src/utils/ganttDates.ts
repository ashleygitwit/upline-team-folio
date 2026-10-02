const DAY_MS = 86_400_000;

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(date: Date, days: number): Date {
  // Calendar-based arithmetic so the result always lands on local midnight,
  // immune to DST transitions (raw ms math drifts by ±1h across DST and can
  // cause zero-length steps → infinite loops when walking date ranges).
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

export function daysBetween(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / DAY_MS);
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function monthShort(date: Date): string {
  return date.toLocaleString('en-US', { month: 'short' });
}

export interface WeekColumn {
  start: Date;
  label: string;
}

export interface MonthColumn {
  start: Date;
  days: number;
  label: string;
}

export function buildMonthColumns(rangeStart: Date, totalDays: number): MonthColumn[] {
  const months: MonthColumn[] = [];
  let cursor = new Date(rangeStart);
  let remaining = totalDays;

  let guard = 0;
  while (remaining > 0 && guard++ < 1000) {
    const endOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const daysInSlice = Math.max(1, Math.min(daysBetween(cursor, endOfMonth) + 1, remaining));
    months.push({
      start: new Date(cursor),
      days: daysInSlice,
      label: cursor.toLocaleString('en-US', { month: 'short', year: 'numeric' }),
    });
    cursor = addDays(cursor, daysInSlice);
    remaining -= daysInSlice;
  }

  return months;
}

export function buildWeekColumns(rangeStart: Date, totalDays: number): WeekColumn[] {
  const weeks: WeekColumn[] = [];
  const numWeeks = totalDays / 7;

  for (let i = 0; i < numWeeks; i++) {
    const cursor = addDays(rangeStart, i * 7);
    const weekEnd = addDays(cursor, 6);
    const label =
      cursor.getMonth() === weekEnd.getMonth()
        ? `${cursor.getDate()}–${weekEnd.getDate()} ${monthShort(cursor)}`
        : `${cursor.getDate()} ${monthShort(cursor)} – ${weekEnd.getDate()} ${monthShort(weekEnd)}`;
    weeks.push({ start: cursor, label });
  }

  return weeks;
}

export interface PeriodColumn {
  start: Date;
  days: number;
  label: string;
}

export function buildQuarterColumns(rangeStart: Date, totalDays: number): PeriodColumn[] {
  const cols: PeriodColumn[] = [];
  let cursor = new Date(rangeStart);
  let remaining = totalDays;
  let guard = 0;
  while (remaining > 0 && guard++ < 1000) {
    const quarter = Math.floor(cursor.getMonth() / 3);
    const quarterEnd = new Date(cursor.getFullYear(), (quarter + 1) * 3, 0);
    const daysInSlice = Math.max(1, Math.min(daysBetween(cursor, quarterEnd) + 1, remaining));
    cols.push({
      start: new Date(cursor),
      days: daysInSlice,
      label: `Q${quarter + 1} ${cursor.getFullYear()}`,
    });
    cursor = addDays(cursor, daysInSlice);
    remaining -= daysInSlice;
  }
  return cols;
}

export function buildYearColumns(rangeStart: Date, totalDays: number): PeriodColumn[] {
  const cols: PeriodColumn[] = [];
  let cursor = new Date(rangeStart);
  let remaining = totalDays;
  let guard = 0;
  while (remaining > 0 && guard++ < 1000) {
    const yearEnd = new Date(cursor.getFullYear(), 11, 31);
    const daysInSlice = Math.max(1, Math.min(daysBetween(cursor, yearEnd) + 1, remaining));
    cols.push({
      start: new Date(cursor),
      days: daysInSlice,
      label: String(cursor.getFullYear()),
    });
    cursor = addDays(cursor, daysInSlice);
    remaining -= daysInSlice;
  }
  return cols;
}

export function startOfToday(date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function formatWeekRange(date = new Date()): string {
  const start = startOfWeek(date);
  const end = addDays(start, 6);
  const startLabel = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endLabel = end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${startLabel} – ${endLabel}`;
}

export function computeRange(initiatives: { start: string; end: string }[]) {
  const starts = initiatives.map((i) => parseDate(i.start));
  const ends = initiatives.map((i) => parseDate(i.end));
  const min = new Date(Math.min(...starts.map((d) => d.getTime())));
  const max = new Date(Math.max(...ends.map((d) => d.getTime())));
  const rangeStart = addDays(startOfWeek(min), -7);
  const rangeEnd = addDays(startOfWeek(max), 21);
  const rawTotal = daysBetween(rangeStart, rangeEnd) + 1;
  const totalDays = Math.ceil(rawTotal / 7) * 7;
  return { rangeStart, rangeEnd, totalDays };
}

export type TimelineZoom = 'Day' | 'Week' | 'Month' | 'Quarter';

/** Visible window for a zoom level, anchored to today. The chart stops at this view. */
export function computeViewWindow(viewMode: TimelineZoom, today = startOfToday()) {
  if (viewMode === 'Day') {
    const rangeStart = startOfWeek(today);
    return { rangeStart, totalDays: 7 };
  }
  if (viewMode === 'Week') {
    const rangeStart = startOfWeek(today);
    return { rangeStart, totalDays: 28 };
  }
  if (viewMode === 'Month') {
    const rangeStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const rangeEnd = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    return { rangeStart, totalDays: daysBetween(rangeStart, rangeEnd) + 1 };
  }
  const quarterMonth = Math.floor(today.getMonth() / 3) * 3;
  const rangeStart = new Date(today.getFullYear(), quarterMonth, 1);
  const rangeEnd = new Date(today.getFullYear(), quarterMonth + 12, 0);
  return { rangeStart, totalDays: daysBetween(rangeStart, rangeEnd) + 1 };
}

export function clipToWindow(
  start: Date,
  end: Date,
  rangeStart: Date,
  totalDays: number,
): { start: Date; end: Date } | null {
  const rangeEnd = addDays(rangeStart, totalDays - 1);
  if (end < rangeStart || start > rangeEnd) return null;
  return {
    start: start < rangeStart ? rangeStart : start,
    end: end > rangeEnd ? rangeEnd : end,
  };
}
