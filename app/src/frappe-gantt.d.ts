declare module 'frappe-gantt' {
  export interface FrappeTask {
    id: string;
    name: string;
    start: string;
    end: string;
    progress?: number;
    custom_class?: string;
  }

  export default class Gantt {
    constructor(
      element: HTMLElement,
      tasks: FrappeTask[],
      options?: Record<string, unknown>,
    );
    refresh(tasks: FrappeTask[]): void;
    change_view_mode(mode: string): void;
  }
}
