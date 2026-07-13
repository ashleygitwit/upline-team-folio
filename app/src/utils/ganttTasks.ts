import type { VenturePlan } from '../types';

export const STATUS_COLORS = {
  'In Flight': 'var(--chart-1)',
  Next: 'var(--chart-2)',
  Future: 'var(--muted-foreground)',
  Done: 'var(--chart-5)',
} as const;

export const STATUS_TEXT_COLORS = {
  'In Flight': 'var(--primary-foreground)',
  Next: 'var(--foreground)',
  Future: 'var(--primary-foreground)',
  Done: 'var(--primary-foreground)',
} as const;

export function touchPlan(plan: VenturePlan): VenturePlan {
  return {
    ...plan,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}
