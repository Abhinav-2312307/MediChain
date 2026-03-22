import { NavLink, Outlet } from "react-router-dom";
import { Classic } from "@theme-toggles/react";
import { Activity, FileText, Heart, MessageCircle, User } from "lucide-react";
import "@theme-toggles/react/css/Classic.css";
import usePatient from "../hooks/usePatient";
import Loader from "../components/ui/Loader";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { to: "dashboard", label: "Dashboard", icon: Activity },
  { to: "profile", label: "Profile", icon: User },
  { to: "medical", label: "Medical", icon: Heart },
  { to: "diagnostics", label: "Diagnostics", icon: FileText },
  { to: "chat", label: "Chat", icon: MessageCircle },
];

export default function PatientLayout() {
  const { patient, loading, error, setPatient } = usePatient();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <aside className="w-20 shrink-0 border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950 sm:w-64">
        <div className="p-4 text-lg font-semibold text-slate-900 dark:text-slate-100 sm:p-6 sm:text-xl">
          <span className="hidden sm:inline">MediVault</span>
          <span className="sm:hidden">MV</span>
        </div>

        <nav>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 px-4 py-3 text-left text-slate-700 transition dark:text-slate-200 ${
                  isActive
                    ? "bg-slate-100 font-medium dark:bg-slate-900"
                    : "hover:bg-slate-100 dark:hover:bg-slate-900"
                }`
              }
            >
              <item.icon size={18} />
              <span className="hidden sm:inline">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 sm:text-3xl">
              Patient Portal
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Welcome back{patient?.name ? `, ${patient.name}` : ""}.
            </p>
          </div>

          <Classic
            duration={750}
            toggled={isDark}
            onClick={toggleTheme}
            className="flex items-center justify-center text-4xl text-slate-600 transition-all dark:text-yellow-400"
            aria-label="Toggle Theme"
          />
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-slate-800/60 dark:bg-slate-900/80 sm:p-6">
          {loading && !patient ? <Loader label="Loading patient data..." /> : null}
          {!loading && error ? <div className="text-red-600">{error}</div> : null}
          {!error && patient ? <Outlet context={{ patient, setPatient }} /> : null}
        </div>
      </main>
    </div>
  );
}
