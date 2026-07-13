import type { Initiative, VenturePlan } from '../types';
import { buildExecutionPlanMarkdown } from './planMarkdown';

const STORAGE_KEY = 'upline-venture-plan';

export function formatDateInput(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function loadPlanFromStorage(): VenturePlan | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!isValidPlan(parsed)) {
      clearPlanStorage();
      return null;
    }
    return parsed;
  } catch {
    clearPlanStorage();
    return null;
  }
}

export function savePlanToStorage(plan: VenturePlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

export function clearPlanStorage(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function generateExportMarkdown(plan: VenturePlan): string {
  try {
    return buildExecutionPlanMarkdown(plan);
  } catch (err) {
    console.error('Failed to generate execution plan markdown', err);
    return '# Upline Venture — Execution Plan\n\n*(Export unavailable — plan data could not be formatted.)*';
  }
}

function isValidPlan(value: unknown): value is VenturePlan {
  if (!value || typeof value !== 'object') return false;
  const plan = value as Partial<VenturePlan>;
  return (
    typeof plan.venture === 'object' &&
    plan.venture !== null &&
    Array.isArray(plan.initiatives)
  );
}

export function newInitiativeId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${slug || 'initiative'}-${Date.now().toString(36)}`;
}

export type { Initiative };
