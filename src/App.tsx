import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/app-shell";
import { AddPaperPage } from "@/pages/add-paper-page";
import { AnalyticsPage } from "@/pages/analytics-page";
import { LibraryPage } from "@/pages/library-page";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<AnalyticsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/add" element={<AddPaperPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
