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

export interface VentureContext {
  thesis: string;
  mantra: string;
  upcomingProofPoint: string;
}

export interface VenturePlan {
  lastUpdated: string;
  venture: VentureContext;
  initiatives: Initiative[];
}
