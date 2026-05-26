import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { signIn, signUp, setApiAuthToken, setUnauthorizedHandler } from "./api";
import type { User } from "./types";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: { fullName: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
};

type StoredSession = {
  token: string;
  user: User;
};

const STORAGE_KEY = "research-paper-tracker-session";
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw) as StoredSession;
        setUser(session.user);
        setApiAuthToken(session.token);
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(logout);
    return () => setUnauthorizedHandler(null);
  }, []);

  async function login(input: { email: string; password: string }) {
    const auth = await signIn(input);
    persistSession(auth.token, auth.user);
    setUser(auth.user);
  }

  async function signup(input: { fullName: string; email: string; password: string }) {
    const auth = await signUp(input);
    persistSession(auth.token, auth.user);
    setUser(auth.user);
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setApiAuthToken(null);
    setUser(null);
  }

  function persistSession(token: string, nextUser: User) {
    setApiAuthToken(token);
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token,
        user: nextUser
      })
    );
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isReady,
      login,
      signup,
      logout
    }),
    [user, isReady]
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
