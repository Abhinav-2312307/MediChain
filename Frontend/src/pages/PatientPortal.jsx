import { useEffect, useState } from "react";
import PatientSidebar from "../components/portal/PatientSidebar";
import { useTheme } from "../context/ThemeContext";
import { Classic } from "@theme-toggles/react";
import "@theme-toggles/react/css/Classic.css";

import Dashboard from "../components/portal/Dashboard/Dashboard";
import Profile from "../components/portal/Profile/Profile";
import MedicalHistory from "../components/portal/MedicalHistory/MedicalHistory";
import CurrentHealth from "../components/portal/CurrentHealth/CurrentHealth";
import Diagnostics from "../components/portal/Diagnostics/Diagnostics";
import PatientChat from "../components/portal/Chat/PatientChat";

const CACHE_KEY = "medivault_patient_cache_v1";
const CACHE_TTL_MS = 5 * 60 * 1000;

function readCachedPatient() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.data || !parsed?.ts) return null;
    if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

function writeCachedPatient(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, ts: Date.now() })
    );
  } catch {
    // ignore cache write errors
  }
}

export default function PatientPortal() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patient, setPatient] = useState(() => readCachedPatient());
  const [loading, setLoading] = useState(!patient);
  const [error, setError] = useState("");
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function loadPatient() {
      const cached = readCachedPatient();
      if (cached) {
        setPatient(cached);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const res = await fetch(
          `${import.meta.env.VITE_Backend_API_URL}/dashboard/patient/data`,
          { credentials: "include" }
        );

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) {
          setPatient(data?.patient || null);
          setLoading(false);
          writeCachedPatient(data?.patient || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Unable to load patient data.");
          setLoading(false);
        }
      }
    }

    loadPatient();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">

      <PatientSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100">
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
            className="text-slate-600 dark:text-yellow-400 transition-all text-4xl flex items-center justify-center"
            aria-label="Toggle Theme"
          />
        </div>

        <div className="rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 shadow-sm backdrop-blur p-4 sm:p-6">
          {loading && (
            <div className="text-slate-500 dark:text-slate-400">
              Loading patient data...
            </div>
          )}

          {!loading && error && (
            <div className="text-red-600">{error}</div>
          )}

          {!loading && !error && activeTab === "dashboard" && (
            <Dashboard patient={patient} />
          )}

          {!loading && !error && activeTab === "profile" && (
            <Profile patient={patient} setPatient={setPatient} />
          )}

          {!loading && !error && activeTab === "history" && (
            <MedicalHistory patient={patient} />
          )}

          {!loading && !error && activeTab === "health" && (
            <CurrentHealth patient={patient} />
          )}

          {!loading && !error && activeTab === "diagnostics" && (
            <Diagnostics patient={patient} />
          )}

          {!loading && !error && activeTab === "chat" && (
            <PatientChat patient={patient} />
          )}
        </div>
      </div>
    </div>
  );
}
