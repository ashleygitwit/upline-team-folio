import { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt';
import type { Initiative, InitiativeStatus } from '../types';
import '../../node_modules/frappe-gantt/dist/frappe-gantt.css';
import './TimelineGantt.css';

const STATUS_CLASS: Record<InitiativeStatus, string> = {
  'In Flight': 'status-in-flight',
  Next: 'status-next',
  Future: 'status-future',
  Done: 'status-done',
};

const STATUS_PROGRESS: Record<InitiativeStatus, number> = {
  'In Flight': 55,
  Next: 20,
  Future: 10,
  Done: 100,
};

export type TimelineZoom = 'Day' | 'Week' | 'Month';

interface TimelineGanttProps {
  initiatives: Initiative[];
  viewMode: TimelineZoom;
  onDateChange: (id: string, start: string, end: string) => void;
}

function formatLocalDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toFrappeTasks(initiatives: Initiative[]) {
  return initiatives.map((initiative) => ({
    id: initiative.id,
    name: initiative.title,
    start: initiative.start,
    end: initiative.end,
    progress: STATUS_PROGRESS[initiative.status],
    custom_class: STATUS_CLASS[initiative.status],
  }));
}

export function TimelineGantt({ initiatives, viewMode, onDateChange }: TimelineGanttProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Gantt | null>(null);
  const onDateChangeRef = useRef(onDateChange);
  const viewModeRef = useRef(viewMode);

  onDateChangeRef.current = onDateChange;
  viewModeRef.current = viewMode;

  useEffect(() => {
    if (!containerRef.current || initiatives.length === 0) return;

    const tasks = toFrappeTasks(initiatives);

    if (!chartRef.current) {
      chartRef.current = new Gantt(containerRef.current, tasks, {
        view_mode: viewModeRef.current,
        view_mode_select: false,
        today_button: true,
        scroll_to: 'today',
        bar_height: 28,
        padding: 16,
        column_width:
          viewModeRef.current === 'Month' ? 100 : viewModeRef.current === 'Week' ? 120 : 44,
        readonly_dates: false,
        readonly_progress: true,
        popup_on: 'click',
        on_date_change: (task: { id: string | number }, start: Date, end: Date) => {
          onDateChangeRef.current(String(task.id), formatLocalDate(start), formatLocalDate(end));
        },
        popup: (ctx: {
          task: { id: string | number; name: string };
          set_title: (v: string) => void;
          set_subtitle: (v: string) => void;
          set_details: (v: string) => void;
        }) => {
          const initiative = initiatives.find((i) => i.id === ctx.task.id);
          ctx.set_title(ctx.task.name);
          if (initiative) {
            ctx.set_subtitle(
              `${initiative.workstream} · ${initiative.status} · ${initiative.owner}`,
            );
            if (initiative.notes) ctx.set_details(initiative.notes);
          }
        },
      });
      return;
    }

    chartRef.current.refresh(tasks);
    chartRef.current.change_view_mode(viewMode);
  }, [initiatives, viewMode]);

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      chartRef.current = null;
    };
  }, []);

  if (initiatives.length === 0) {
    return <p className="empty">No initiatives match these filters.</p>;
  }

  return <div className="timeline-gantt" ref={containerRef} />;
}
