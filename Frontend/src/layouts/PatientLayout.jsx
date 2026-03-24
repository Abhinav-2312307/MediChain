import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  FileHeart,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageCircleMore,
  UserCircle2,
  X,
} from "lucide-react";
import { Classic } from "@theme-toggles/react";

import "@theme-toggles/react/css/Classic.css";

import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { useTheme } from "../context/ThemeContext";
import { selectCurrentUser, selectIsAuthenticated } from "../features/auth/authSelectors";
import {
  selectPatientData,
  selectPatientError,
  selectPatientLoading,
} from "../features/patient/patientSelectors";
import { fetchPatientProfile } from "../features/patient/patientThunks";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import { formatDate, getInitials, normalizeList } from "../lib/patient";

const mediChainLogo = "/medichain%20Icon.png";

const navItems = [
  { to: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "profile", label: "Profile", icon: UserCircle2 },
  { to: "medical-history", label: "Medical History", icon: FileHeart },
  { to: "current-health", label: "Current Health", icon: HeartPulse },
  { to: "diagnostics", label: "Diagnostics", icon: Activity },
  { to: "chat", label: "Chat", icon: MessageCircleMore },
];

function getPatientFallback(user) {
  if (!user?.name && !user?.email) {
    return null;
  }

  return user;
}

function getNavLinkClasses(isActive) {
  return `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-blue-50 text-blue-700 dark:bg-emerald-500/12 dark:text-emerald-200"
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
  }`;
}

function isSameCalendarDay(value, referenceDate = new Date()) {
  if (!value) {
    return false;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getFullYear() === referenceDate.getFullYear() &&
    date.getMonth() === referenceDate.getMonth() &&
    date.getDate() === referenceDate.getDate()
  );
}

function formatTime(value) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function PatientIdentity({ patient }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {patient?.profilePic ? (
            <img src={patient.profilePic} alt="Profile" className="h-full w-full object-cover" />
          ) : (
            getInitials(patient?.name)
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
            {patient?.name || "Patient"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {patient?.email || "Email unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PatientLayout() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authUser = useAppSelector(selectCurrentUser);
  const patientProfile = useAppSelector(selectPatientData);
  const loading = useAppSelector(selectPatientLoading);
  const error = useAppSelector(selectPatientError);

  const patient = patientProfile ?? getPatientFallback(authUser);
  const currentItem =
    navItems.find((item) => location.pathname.includes(item.to)) || navItems[0];
  const portalBasePath = location.pathname.startsWith("/patient-portal")
    ? "/patient-portal"
    : "/patient";
  const todayLabel = formatDate(new Date(), "Today");
  const reminderCount = normalizeList(patient?.diagnostics?.immunizationReminders).length;
  const hasTodayAppointment = isSameCalendarDay(patient?.admin?.nextAppointment);
  const todaySeparator = "\u2022";
  const todayAppointmentTime = formatTime(patient?.admin?.nextAppointment);
  const todayStatusTitle = hasTodayAppointment
    ? `Today ${todaySeparator} ${todayLabel}`
    : reminderCount > 0
      ? `Today ${todaySeparator} ${reminderCount} task${reminderCount === 1 ? "" : "s"} pending`
      : `Today ${todaySeparator} ${todayLabel}`;
  const todayStatusDetail = hasTodayAppointment
    ? `Appointment at ${todayAppointmentTime || "scheduled time pending"}`
    : reminderCount > 0
      ? "Review reminders and follow-ups"
      : "No appointments today";
  const taskShortcutHref = reminderCount > 0 ? `${portalBasePath}/diagnostics` : null;

  useEffect(() => {
    if (isAuthenticated && !patientProfile && !loading) {
      void dispatch(fetchPatientProfile());
    }
  }, [dispatch, isAuthenticated, loading, patientProfile]);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close navigation"
          />

          <div className="absolute left-0 top-0 flex h-full w-[88vw] max-w-xs flex-col border-r border-slate-200 bg-white px-4 py-5 shadow-2xl transition-colors dark:border-slate-800 dark:bg-navbar-bg">
            <div className="mb-6 flex items-center justify-between gap-3">
              <Link
                to="/patient/dashboard"
                className="flex items-center gap-3 transition-opacity hover:opacity-80"
                onClick={() => setMobileNavOpen(false)}
              >
                <img
                  src={mediChainLogo}
                  alt="MediChain logo"
                  className="h-11 w-11 rounded-2xl border border-slate-200 bg-white p-2 object-contain shadow-sm dark:border-slate-700 dark:bg-slate-900"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-emerald-300">
                    MediChain
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Patient Portal</p>
                </div>
              </Link>

              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => getNavLinkClasses(isActive)}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto pt-6">
              <PatientIdentity patient={patient} />
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white/95 px-5 py-6 transition-colors dark:border-slate-800 dark:bg-navbar-bg/90 lg:sticky lg:top-0 lg:flex lg:flex-col">
          <div className="flex h-full flex-col">
            <div>
              <Link
                to="/patient/dashboard"
                className="mb-8 flex items-center gap-3 px-2 transition-opacity hover:opacity-80"
              >
                <img
                  src={mediChainLogo}
                  alt="MediChain logo"
                  className="h-12 w-12 rounded-2xl border border-slate-200 bg-white p-2 object-contain shadow-sm dark:border-slate-700 dark:bg-slate-900"
                />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-emerald-300">
                    MediChain
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Patient Portal</p>
                </div>
              </Link>

              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => getNavLinkClasses(isActive)}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="mt-auto pt-6">
              <PatientIdentity patient={patient} />
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/85">
            <div className="flex flex-col gap-3 px-4 py-1 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3 lg:items-center">
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(true)}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 lg:hidden"
                    aria-label="Open navigation"
                  >
                    <Menu size={18} />
                  </button>

                  <div className="min-w-0">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Patient Portal</p>
                    <h1 className="mt-1 truncate text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {currentItem.label}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <div className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center transition-colors dark:border-slate-800 dark:bg-slate-900/80 sm:w-auto sm:min-w-[240px] sm:text-right">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {todayStatusTitle}
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
                      {todayStatusDetail}
                    </p>
                    {taskShortcutHref ? (
                      <Link
                        to={taskShortcutHref}
                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700 dark:text-emerald-300 dark:hover:text-emerald-200"
                      >
                        Open pending tasks
                        <ArrowRight size={16} />
                      </Link>
                    ) : null}
                  </div>

                  <Classic
                    duration={750}
                    toggled={isDark}
                    onClick={toggleTheme}
                    className="shrink-0 text-4xl text-slate-600 transition-all dark:text-yellow-400"
                    aria-label="Toggle theme"
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8">
            {loading && !patient ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
                <Loader label="Loading patient profile..." />
              </div>
            ) : null}

            {error ? (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 transition-colors dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p>{error}</p>
                  <Button
                    variant="danger"
                    onClick={() => void dispatch(fetchPatientProfile({ force: true }))}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            ) : null}

            {patient ? (
              <Outlet context={{ patient }} />
            ) : !loading && !error ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-500 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                No patient profile is available yet.
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  );
}
