import type { Task } from 'gantt-task-react';
import type { Initiative, InitiativeStatus, VenturePlan } from '../types';

export const STATUS_COLORS: Record<InitiativeStatus, string> = {
  'In Flight': '#4338CA',
  Next: '#6366F1',
  Future: '#94A3B8',
  Done: '#16A34A',
};

export function buildGanttTasks(initiatives: Initiative[]): Task[] {
  const grouped = new Map<string, Initiative[]>();

  for (const initiative of initiatives) {
    const list = grouped.get(initiative.workstream) ?? [];
    list.push(initiative);
    grouped.set(initiative.workstream, list);
  }

  const tasks: Task[] = [];
  let order = 0;

  for (const [workstream, items] of [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const starts = items.map((i) => new Date(i.start).getTime());
    const ends = items.map((i) => new Date(i.end).getTime());
    const projectStart = new Date(Math.min(...starts));
    const projectEnd = new Date(Math.max(...ends));
    if (projectEnd <= projectStart) {
      projectEnd.setDate(projectStart.getDate() + 1);
    }

    const projectId = `project-${workstream}`;

    tasks.push({
      id: projectId,
      name: workstream,
      type: 'project',
      start: projectStart,
      end: projectEnd,
      progress: 0,
      hideChildren: false,
      displayOrder: order++,
      styles: {
        backgroundColor: '#E0E7FF',
        backgroundSelectedColor: '#C7D2FE',
        progressColor: '#4338CA',
        progressSelectedColor: '#4338CA',
      },
    });

    for (const initiative of items) {
      tasks.push(initiativeToTask(initiative, projectId, order++));
    }
  }

  return tasks;
}

function initiativeToTask(initiative: Initiative, projectId: string, displayOrder: number): Task {
  const start = new Date(initiative.start);
  const end = new Date(initiative.end);
  if (end <= start) {
    end.setDate(start.getDate() + 1);
  }

  return {
    id: initiative.id,
    name: initiative.title,
    type: 'task',
    start,
    end,
    progress:
      initiative.status === 'Done' ? 100 : initiative.status === 'In Flight' ? 55 : 15,
    project: projectId,
    styles: {
      backgroundColor: STATUS_COLORS[initiative.status],
      backgroundSelectedColor: STATUS_COLORS[initiative.status],
      progressColor: '#312E81',
      progressSelectedColor: '#312E81',
    },
    displayOrder,
  };
}

export function touchPlan(plan: VenturePlan): VenturePlan {
  return {
    ...plan,
    lastUpdated: new Date().toISOString().slice(0, 10),
  };
}
