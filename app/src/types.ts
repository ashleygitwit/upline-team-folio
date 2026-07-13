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

export interface VentureThesis {
  problem: string;
  worldAfter: string;
  approach: string;
}

export interface UpcomingProofPoint {
  description: string;
  successCriteria: string[];
}

export interface VentureContext {
  hypothesis: string;
  thesis: VentureThesis;
  mantra: string;
  upcomingProofPoint: UpcomingProofPoint;
}

export interface VenturePlan {
  lastUpdated: string;
  venture: VentureContext;
  initiatives: Initiative[];
}
