import { Suspense, lazy } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth";

const AddPaperPage = lazy(() => import("@/pages/add-paper-page").then((module) => ({ default: module.AddPaperPage })));
const AnalyticsPage = lazy(() => import("@/pages/analytics-page").then((module) => ({ default: module.AnalyticsPage })));
const AuthPage = lazy(() => import("@/pages/auth-page").then((module) => ({ default: module.AuthPage })));
const LibraryPage = lazy(() => import("@/pages/library-page").then((module) => ({ default: module.LibraryPage })));

export default function App() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return <AppLoadingScreen />;
  }

  return (
    <Suspense fallback={<AppLoadingScreen />}>
      <Routes>
        <Route path="/auth" element={isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />} />
        <Route element={<ProtectedLayout isAuthenticated={isAuthenticated} />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<AnalyticsPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/add" element={<AddPaperPage />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} replace />} />
      </Routes>
    </Suspense>
  );
}

function ProtectedLayout({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}

function AppLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f4f4ef_0%,#eef4f2_100%)] px-6">
      <div className="rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 text-sm font-medium text-slate-600 shadow-panel backdrop-blur">
        Loading workspace...
      </div>
    </div>
  );
}
