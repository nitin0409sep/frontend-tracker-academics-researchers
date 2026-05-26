import { BarChart3, BookPlus, LibraryBig, LogOut, Menu, Sparkles } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const navItems = [
  { to: "/", label: "Analytics", icon: BarChart3 },
  { to: "/library", label: "Paper Library", icon: LibraryBig },
  { to: "/add", label: "Add Paper", icon: BookPlus }
];

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-paper-grid bg-[size:22px_22px] opacity-20" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(33,90,106,0.12),transparent_58%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-[1480px] flex-col gap-4 p-3 lg:flex-row lg:p-5">
        <aside className="border border-white/70 bg-[linear-gradient(180deg,rgba(18,48,61,0.96),rgba(27,59,73,0.93))] px-4 py-4 text-white shadow-panel backdrop-blur lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-[318px] lg:rounded-[34px] lg:px-6 lg:py-7">
          <div className="flex items-center justify-between lg:block">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
                Research OS
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-[-0.04em] lg:text-[2rem]">Paper Reading Tracker</h1>
                <p className="mt-3 hidden text-sm leading-6 text-white/70 lg:block">
                  Track what you read, what still needs deep work, and where your strongest papers sit.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 lg:hidden"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          <nav className={cn("mt-6 hidden flex-col gap-2 lg:flex", menuOpen && "flex")}>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-[22px] px-4 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-white text-slate-900 shadow-soft"
                      : "text-white/72 hover:bg-white/10 hover:text-white"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 flex flex-col gap-4 lg:mt-auto lg:pt-6">
            <div className="rounded-[28px] border border-white/10 bg-white/10 p-5">
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f1d8a6] text-slate-900">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold tracking-[-0.03em]">Research workflow</h2>
              <p className="mt-2 text-sm leading-6 text-white/68">
                A calm workspace for collecting papers, evaluating impact, and pushing reading toward completion.
              </p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">Signed in as</p>
              <p className="mt-2 truncate text-sm font-medium text-white">{user?.fullName}</p>
              <p className="truncate text-xs text-white/65">{user?.email}</p>
              <button
                type="button"
                onClick={logout}
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/16"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="app-shell-main app-scrollbar relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(255,255,255,0.45))] px-4 py-6 shadow-panel backdrop-blur sm:px-6 lg:max-h-[calc(100vh-2.5rem)] lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
