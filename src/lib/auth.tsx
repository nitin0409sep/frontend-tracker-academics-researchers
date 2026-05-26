import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  logoutSession,
  refreshSession,
  setApiAuthToken,
  setRefreshHandler,
  setUnauthorizedHandler,
  signIn,
  signUp
} from "./api";
import type { User } from "./types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

type StoredSession = {
  token: string;
  refreshToken: string;
  user: User;
};

const STORAGE_KEY = "research-paper-tracker-session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<StoredSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const nextSession = JSON.parse(raw) as StoredSession;
        setSession(nextSession);
        setApiAuthToken(nextSession.token);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void clearSessionLocally();
    });
    setRefreshHandler(handleRefresh);
    return () => {
      setUnauthorizedHandler(null);
      setRefreshHandler(null);
    };
  }, [session]);

  async function login(input: { email: string; password: string }) {
    const auth = await signIn(input);
    persistSession(auth.token, auth.refreshToken, auth.user);
  }

  async function signup(input: { fullName: string; email: string; password: string }) {
    const auth = await signUp(input);
    persistSession(auth.token, auth.refreshToken, auth.user);
  }

  async function logout() {
    const refreshToken = session?.refreshToken;
    await clearSessionLocally();

    if (refreshToken) {
      try {
        await logoutSession({ refreshToken });
      } catch {
        // Local sign-out takes priority if the network is unavailable.
      }
    }
  }

  async function handleRefresh() {
    if (!session?.refreshToken) {
      await clearSessionLocally();
      return null;
    }

    try {
      const auth = await refreshSession({ refreshToken: session.refreshToken });
      persistSession(auth.token, auth.refreshToken, auth.user);
      return auth.token;
    } catch {
      await clearSessionLocally();
      return null;
    }
  }

  async function clearSessionLocally() {
    window.localStorage.removeItem(STORAGE_KEY);
    setApiAuthToken(null);
    setSession(null);
  }

  function persistSession(token: string, refreshToken: string, user: User) {
    const nextSession = { token, refreshToken, user };
    setApiAuthToken(token);
    setSession(nextSession);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
  }

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      isReady,
      login,
      signup,
      logout
    }),
    [session, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
