import type { DatePreset, ImpactScore, ReadingStage, ResearchDomain } from "./constants";

export type User = {
  id: number;
  fullName: string;
  email: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  user: User;
};

export type Paper = {
  id: number;
  paperTitle: string;
  firstAuthorName: string;
  researchDomain: ResearchDomain;
  readingStage: ReadingStage;
  citationCount: number;
  impactScore: ImpactScore;
  dateAdded: string;
  createdAt: string;
};

export type PaperFilters = {
  readingStage: ReadingStage[];
  researchDomain: ResearchDomain[];
  impactScore: ImpactScore[];
  dateRangePreset: DatePreset;
};

export type AnalyticsResponse = {
  funnel: { stage: ReadingStage; count: number }[];
  scatter: {
    id: number;
    paperTitle: string;
    citationCount: number;
    impactScore: ImpactScore;
    researchDomain: ResearchDomain;
    readingStage: ReadingStage;
    yGroup: number;
  }[];
  stackedByDomainAndStage: Array<{ domain: ResearchDomain } & Record<ReadingStage, number>>;
  summary: {
    papersByStage: { stage: ReadingStage; count: number }[];
    averageCitationsPerDomain: { domain: ResearchDomain; averageCitations: string }[];
    completionRate: number;
    totalPapers: number;
    fullyRead: number;
  };
};
