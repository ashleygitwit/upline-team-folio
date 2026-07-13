import type { VenturePlan } from '../types';

export const STATUS_COLORS = {
  'In Flight': '#4338CA',
  Next: '#6366F1',
  Future: '#94A3B8',
  Done: '#16A34A',
} as const;

export function touchPlan(plan: VenturePlan): VenturePlan {
  return {
    ...plan,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}
