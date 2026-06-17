import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react"
import {
  logoutSession,
  refreshSession,
  setApiAuthToken,
  setRefreshHandler,
  setUnauthorizedHandler,
  signIn,
  signUp
} from "@/shared/lib/api"
import type { User } from "@/shared/lib/types"

type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isReady: boolean
  login: (input: { email: string; password: string }) => Promise<void>
  signup: (input: { fullName: string; email: string; password: string }) => Promise<void>
  logout: () => Promise<void>
}

type StoredSession = {
  token: string
  refreshToken: string
  user: User
}

const STORAGE_KEY = "research-paper-tracker-session"
const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null)
  const [isReady, setIsReady] = useState(false)
  const activeRefreshToken = session?.refreshToken
  const activeUser = session?.user ?? null

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const nextSession = JSON.parse(raw) as StoredSession
        setSession(nextSession)
        setApiAuthToken(nextSession.token)
      } catch {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsReady(true)
  }, [])

  const persistSession = useCallback((token: string, refreshToken: string, user: User) => {
    const nextSession = { token, refreshToken, user }
    setApiAuthToken(token)
    setSession(nextSession)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
  }, [])

  const clearSessionLocally = useCallback(async () => {
    window.localStorage.removeItem(STORAGE_KEY)
    setApiAuthToken(null)
    setSession(null)
  }, [])

  const login = useCallback(async (input: { email: string; password: string }) => {
    const auth = await signIn(input)
    persistSession(auth.token, auth.refreshToken, auth.user)
  }, [persistSession])

  const signup = useCallback(async (input: { fullName: string; email: string; password: string }) => {
    const auth = await signUp(input)
    persistSession(auth.token, auth.refreshToken, auth.user)
  }, [persistSession])

  const logout = useCallback(async () => {
    await clearSessionLocally()

    if (activeRefreshToken) {
      try {
        await logoutSession({ refreshToken: activeRefreshToken })
      } catch {
        // Local sign-out takes priority if the network is unavailable.
      }
    }
  }, [activeRefreshToken, clearSessionLocally])

  const handleRefresh = useCallback(async () => {
    if (!activeRefreshToken) {
      await clearSessionLocally()
      return null
    }

    try {
      const auth = await refreshSession({ refreshToken: activeRefreshToken })
      persistSession(auth.token, auth.refreshToken, auth.user)
      return auth.token
    } catch {
      await clearSessionLocally()
      return null
    }
  }, [activeRefreshToken, clearSessionLocally, persistSession])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearSessionLocally()
    })
    setRefreshHandler(handleRefresh)
    return () => {
      setUnauthorizedHandler(null)
      setRefreshHandler(null)
    }
  }, [clearSessionLocally, handleRefresh])

  const value = useMemo(
    () => ({
      user: activeUser,
      isAuthenticated: Boolean(activeUser),
      isReady,
      login,
      signup,
      logout
    }),
    [activeUser, isReady, login, logout, signup]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
