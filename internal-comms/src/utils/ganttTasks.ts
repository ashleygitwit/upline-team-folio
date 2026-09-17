import type { Initiative, VenturePlan } from '../types';

const KNOWN_INITIALS: Record<string, string> = {
  Ashley: 'AR',
  Austin: 'AB',
  Davie: 'DH',
  Patrick: 'PA',
  Jacob: 'JJ',
  Amanda: 'AM',
  Doug: 'DS',
  Douglas: 'DS',
  Agent: 'Ag',
};

export function splitOwners(owner: string): string[] {
  return owner
    .split(/\s*(?:\+|\/|&|,|\band\b)\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function ownerInitials(name: string): string {
  if (KNOWN_INITIALS[name]) return KNOWN_INITIALS[name];
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function uniquePeople(initiatives: Pick<Initiative, 'owner'>[]): string[] {
  const set = new Set<string>();
  for (const item of initiatives) {
    for (const person of splitOwners(item.owner)) set.add(person);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

export function ownerIncludesPerson(owner: string, person: string): boolean {
  return splitOwners(owner).some((name) => name.toLowerCase() === person.toLowerCase());
}

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
