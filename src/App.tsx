import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth";
import { AddPaperPage } from "@/pages/add-paper-page";
import { AnalyticsPage } from "@/pages/analytics-page";
import { AuthPage } from "@/pages/auth-page";
import { LibraryPage } from "@/pages/library-page";

export default function App() {
  const { isAuthenticated, isReady } = useAuth();

  if (!isReady) {
    return null;
  }

  return (
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
  );
}

function ProtectedLayout({ isAuthenticated }: { isAuthenticated: boolean }) {
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
