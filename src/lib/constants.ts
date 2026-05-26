export const researchDomains = [
  "Computer Science",
  "Biology",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Social Sciences"
] as const;

export const readingStages = [
  "Abstract Read",
  "Introduction Done",
  "Methodology Done",
  "Results Analyzed",
  "Fully Read",
  "Notes Completed"
] as const;

export const impactScores = [
  "High Impact",
  "Medium Impact",
  "Low Impact",
  "Unknown"
] as const;

export const datePresets = ["This Week", "This Month", "Last 3 Months", "All Time"] as const;

export type ResearchDomain = (typeof researchDomains)[number];
export type ReadingStage = (typeof readingStages)[number];
export type ImpactScore = (typeof impactScores)[number];
export type DatePreset = (typeof datePresets)[number];
