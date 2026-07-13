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
    return JSON.parse(raw) as VenturePlan;
  } catch {
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
  return buildExecutionPlanMarkdown(plan);
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
