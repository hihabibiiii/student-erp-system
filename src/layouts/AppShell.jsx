import { useState } from "react";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { motion } from "framer-motion";
import { navigation } from "../data/navigation";
import { useTheme } from "../context/ThemeContext";

export default function AppShell({ children, pageName, title }) {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-surface-950/88 p-4 shadow-panel backdrop-blur-2xl transition duration-300 light:border-slate-200/80 light:bg-white/88 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-3" aria-label="Habibi Public School dashboard">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-300 text-lg font-black text-slate-950 shadow-glow">
              H
            </span>
            <span>
              <span className="block text-sm font-extrabold text-title">Habibi Public School</span>
              <span className="text-xs font-semibold text-brand-200 light:text-brand-600">Student ERP</span>
            </span>
          </a>
          <button className="btn-ghost p-2 lg:hidden" type="button" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="mt-8 space-y-1.5" aria-label="Primary navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = item.activePages?.includes(pageName);
            return (
              <a
                key={item.label}
                href={item.href}
                className={active ? "nav-item nav-item-active" : "nav-item"}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="surface-soft absolute bottom-4 left-4 right-4 rounded-2xl p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Session</p>
          <a className="mt-3 flex items-center gap-2 text-sm font-bold text-rose-200 transition hover:text-rose-100 light:text-rose-700 light:hover:text-rose-800" href="/logout">
            <LogOut className="h-4 w-4" />
            Logout
          </a>
        </div>
      </aside>

      {open ? <button className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm lg:hidden" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}

      <div className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-surface-950/72 px-4 py-3 backdrop-blur-2xl light:border-slate-200/80 light:bg-white/76 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <button className="btn-ghost p-2 lg:hidden" type="button" onClick={() => setOpen(true)} aria-label="Open menu">
                <Menu className="h-4 w-4" />
              </button>
              <div className="min-w-0">
                <p className="eyebrow">ERP Console</p>
                <h1 className="truncate text-lg font-extrabold text-title sm:text-2xl">{title || "Dashboard"}</h1>
              </div>
            </div>
            <button className="btn-ghost p-2.5" type="button" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        <motion.div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
          {children}
        </motion.div>
      </div>
    </div>
  );
}
