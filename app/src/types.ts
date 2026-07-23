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

export interface PilotFunnel {
  outreachEmailsDrafted?: number;
  outreachEmailsSent?: number;
  emailsSentTotal?: number;
  questionnairesCompleted?: number;
  quotesReviewedWithAgency?: number;
  recommendationEmailsSent?: number;
  completedEndToEnd?: number;
}

export interface PilotOutreachEmail {
  version: string;
  summary: string;
  subject: string;
  body: string;
}

export interface PilotRecommendationEmail {
  version: string;
  summary: string;
  status: string;
  goldStandardClient?: string;
}

export interface PilotRoster {
  week1Households: number;
  week1OutreachDrafts: number;
  week2Households: number;
  week2OutreachDrafts: number;
  week2EndToEndBuilt: number;
}

export interface PilotNotableProgress {
  client: string;
  note: string;
}

export interface PilotSummary {
  agency: string;
  kickoffDate: string;
  asOfDate: string;
  pilotWeek: number;
  outreachSendWeek?: number;
  sessionRhythm?: string;
  scheduleNote?: string;
  sessionsCompleted: number;
  sessionsPlanned: number;
  clientNamingRule: string;
  funnel: PilotFunnel;
  outreachEmail?: PilotOutreachEmail;
  recommendationEmail?: PilotRecommendationEmail;
  keyFindings?: string[];
  notableProgress?: PilotNotableProgress[];
  roster?: PilotRoster;
}

export interface VenturePlan {
  lastUpdated: string;
  venture: VentureContext;
  workstreams?: string[];
  pilotSummary?: PilotSummary;
  initiatives: Initiative[];
}

export type QuestionStatus = 'Open' | 'Emerging' | 'Answered' | 'Evolved';

export type QuestionLens = 'desirability' | 'viability' | 'feasibility';

export interface OpenQuestion {
  id: string;
  question: string;
  status: QuestionStatus;
  lens: QuestionLens;
  note: string;
}

export type LearningKind = 'milestone' | 'learning';

export interface LearningEntry {
  date: string;
  kind?: LearningKind;
  source?: string;
  title?: string;
  learning: string;
  detail?: string[];
}

export interface Learnings {
  lastUpdated: string;
  intro: string;
  questions: OpenQuestion[];
  entries: LearningEntry[];
}
