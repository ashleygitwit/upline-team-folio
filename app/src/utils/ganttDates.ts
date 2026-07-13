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
  return new Date(date.getTime() + days * DAY_MS);
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

  while (remaining > 0) {
    const endOfMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const daysInSlice = Math.min(daysBetween(cursor, endOfMonth) + 1, remaining);
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
