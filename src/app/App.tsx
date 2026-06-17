import { Suspense, lazy } from "react"
import { Navigate, Outlet, RouterProvider, createBrowserRouter } from "react-router-dom"
import { AppShell } from "@/shared/components/layout/app-shell"
import { useAuth } from "@/features/auth/lib/auth-context"

const AddPaperPage = lazy(() =>
  import("@/features/papers/pages/add-paper-page").then((module) => ({
    default: module.AddPaperPage
  }))
)
const AnalyticsPage = lazy(() =>
  import("@/features/analytics/pages/analytics-page").then((module) => ({
    default: module.AnalyticsPage
  }))
)
const AuthPage = lazy(() =>
  import("@/features/auth/pages/auth-page").then((module) => ({ default: module.AuthPage }))
)
const LibraryPage = lazy(() =>
  import("@/features/papers/pages/library-page").then((module) => ({ default: module.LibraryPage }))
)

const router = createBrowserRouter([
  {
    element: <AuthReadyLayout />,
    children: [
      {
        path: "/auth",
        element: <AuthRoute />
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                index: true,
                element: <AnalyticsPage />
              },
              {
                path: "library",
                element: <LibraryPage />
              },
              {
                path: "add",
                element: <AddPaperPage />
              }
            ]
          }
        ]
      },
      {
        path: "*",
        element: <FallbackRoute />
      }
    ]
  }
])

export default function App() {
  return <RouterProvider router={router} fallbackElement={<AppLoadingScreen />} />
}

function AuthReadyLayout() {
  const { isReady } = useAuth()

  if (!isReady) {
    return <AppLoadingScreen />
  }

  return (
    <Suspense fallback={<AppLoadingScreen />}>
      <Outlet />
    </Suspense>
  )
}

function AuthRoute() {
  const { isAuthenticated } = useAuth()

  return isAuthenticated ? <Navigate to="/" replace /> : <AuthPage />
}

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

function FallbackRoute() {
  const { isAuthenticated } = useAuth()

  return <Navigate to={isAuthenticated ? "/" : "/auth"} replace />
}

function AppLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f4f4ef_0%,#eef4f2_100%)] px-6">
      <div className="rounded-[28px] border border-white/70 bg-white/70 px-6 py-5 text-sm font-medium text-slate-600 shadow-panel backdrop-blur">
        Loading workspace...
      </div>
    </div>
  )
}
