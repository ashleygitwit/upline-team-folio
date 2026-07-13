import type { Initiative, VenturePlan } from '../types';

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
  const byStatus = (status: Initiative['status']) =>
    plan.initiatives.filter((i) => i.status === status);

  const formatBlock = (items: Initiative[]) => {
    if (items.length === 0) return '*(none)*';
    return items
      .map(
        (i) =>
          `### ${i.title}\n- **Workstream:** ${i.workstream}\n- **Owner:** ${i.owner}\n- **Dates:** ${i.start} → ${i.end}${i.notes ? `\n- **Notes:** ${i.notes}` : ''}`,
      )
      .join('\n\n');
  };

  return [
    '# Upline Venture — Execution Plan',
    '',
    `*Last updated: ${plan.lastUpdated}*`,
    '',
    'Paste this into ChatGPT, Claude, or your preferred LLM to ask about timeline, priorities, and what is in flight.',
    '',
    '---',
    '',
    '## Venture hypothesis',
    '',
    plan.venture.hypothesis,
    '',
    '## Venture thesis',
    '',
    `**Problem:** ${plan.venture.thesis.problem}`,
    '',
    `**World after:** ${plan.venture.thesis.worldAfter}`,
    '',
    `**Our approach:** ${plan.venture.thesis.approach}`,
    '',
    '## Mantra',
    '',
    `> ${plan.venture.mantra}`,
    '',
    '## Upcoming proof point',
    '',
    plan.venture.upcomingProofPoint.description,
    '',
    `**Success:** ${plan.venture.upcomingProofPoint.successCriteria.join(' · ')}`,
    '',
    '---',
    '',
    '## In flight',
    '',
    formatBlock(byStatus('In Flight')),
    '',
    '## Next',
    '',
    formatBlock(byStatus('Next')),
    '',
    '## Future',
    '',
    formatBlock(byStatus('Future')),
    '',
    '## Done',
    '',
    formatBlock(byStatus('Done')),
    '',
    '---',
    '',
    '## Timeline table',
    '',
    '| Initiative | Workstream | Owner | Status | Start | End |',
    '| --- | --- | --- | --- | --- | --- |',
    ...plan.initiatives.map(
      (i) =>
        `| ${i.title} | ${i.workstream} | ${i.owner} | ${i.status} | ${i.start} | ${i.end} |`,
    ),
    '',
  ].join('\n');
}

export function newInitiativeId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
  return `${slug || 'initiative'}-${Date.now().toString(36)}`;
}
