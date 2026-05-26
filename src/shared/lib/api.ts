import type { AnalyticsResponse, AuthResponse, Paper, PaperFilters } from "./types"

const rawApiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"
const apiBaseUrl = normalizeApiBaseUrl(rawApiBaseUrl)
const REQUEST_TIMEOUT_MS = 10000

let authToken: string | null = null
let unauthorizedHandler: (() => void) | null = null
let refreshHandler: (() => Promise<string | null>) | null = null

export function setApiAuthToken(token: string | null) {
  authToken = token
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler
}

export function setRefreshHandler(handler: (() => Promise<string | null>) | null) {
  refreshHandler = handler
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { message?: string } | null
    throw new Error(payload?.message ?? "Something went wrong")
  }

  return response.json() as Promise<T>
}

async function apiFetch<T>(path: string, init?: RequestInit, hasRetried = false): Promise<T> {
  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...(init?.headers ?? {})
      },
      cache: "no-store",
      credentials: "omit",
      referrerPolicy: "strict-origin-when-cross-origin",
      signal: controller.signal
    })

    if (response.status === 401 && !hasRetried && refreshHandler) {
      const refreshedToken = await refreshHandler()
      if (refreshedToken) {
        return apiFetch<T>(path, init, true)
      }
    }

    if (response.status === 401) {
      unauthorizedHandler?.()
    }

    return handleResponse<T>(response)
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.")
    }

    throw error
  } finally {
    window.clearTimeout(timeout)
  }
}

export async function signUp(payload: {
  fullName: string
  email: string
  password: string
}): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

export async function signIn(payload: { email: string; password: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

export async function refreshSession(payload: { refreshToken: string }): Promise<AuthResponse> {
  return apiFetch<AuthResponse>(
    "/auth/refresh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    },
    true
  )
}

export async function logoutSession(payload: { refreshToken: string }) {
  await apiFetch<null>(
    "/auth/logout",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    },
    true
  )
}

export async function fetchPapers(filters: PaperFilters): Promise<Paper[]> {
  const params = new URLSearchParams()

  filters.readingStage.forEach((value) => params.append("readingStage", value))
  filters.researchDomain.forEach((value) => params.append("researchDomain", value))
  filters.impactScore.forEach((value) => params.append("impactScore", value))
  params.set("dateRangePreset", filters.dateRangePreset)

  return apiFetch<Paper[]>(`/papers?${params.toString()}`)
}

export async function createPaper(payload: Omit<Paper, "id" | "createdAt">): Promise<Paper> {
  return apiFetch<Paper>("/papers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  })
}

export async function fetchAnalytics(): Promise<AnalyticsResponse> {
  return apiFetch<AnalyticsResponse>("/analytics")
}

function normalizeApiBaseUrl(value: string) {
  let url: URL

  try {
    url = new URL(value)
  } catch {
    throw new Error("VITE_API_URL must be a valid absolute URL")
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("VITE_API_URL must use http or https")
  }

  const normalizedPath = url.pathname === "/" ? "/api" : url.pathname.replace(/\/$/, "")
  url.pathname = normalizedPath.endsWith("/api") ? normalizedPath : `${normalizedPath}/api`

  return url.toString().replace(/\/$/, "")
}
