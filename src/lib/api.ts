import type { AnalyticsResponse, Paper, PaperFilters } from "./types";

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(payload?.message ?? "Something went wrong");
  }

  return response.json() as Promise<T>;
}

export async function fetchPapers(filters: PaperFilters): Promise<Paper[]> {
  const params = new URLSearchParams();

  filters.readingStage.forEach((value) => params.append("readingStage", value));
  filters.researchDomain.forEach((value) => params.append("researchDomain", value));
  filters.impactScore.forEach((value) => params.append("impactScore", value));
  params.set("dateRangePreset", filters.dateRangePreset);

  const response = await fetch(`${apiBaseUrl}/papers?${params.toString()}`);
  return handleResponse<Paper[]>(response);
}

export async function createPaper(payload: Omit<Paper, "id" | "createdAt">): Promise<Paper> {
  const response = await fetch(`${apiBaseUrl}/papers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return handleResponse<Paper>(response);
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  const response = await fetch(`${apiBaseUrl}/analytics`);
  return handleResponse<AnalyticsResponse>(response);
}
