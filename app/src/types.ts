export type InitiativeStatus = 'In Flight' | 'Next' | 'Future' | 'Done';

export interface Initiative {
  id: string;
  title: string;
  workstream: string;
  status: InitiativeStatus;
  owner: string;
  start: string;
  end: string;
  notes?: string;
}

export interface VenturePlan {
  summary: string;
  lastUpdated: string;
  initiatives: Initiative[];
}
