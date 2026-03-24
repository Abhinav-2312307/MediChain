import { Link } from "react-router-dom";
import { CalendarClock, FileText, Pill, UserRound } from "lucide-react";

import Badge from "../ui/Badge";
import Card from "../ui/Card";
import Section from "../ui/Section";
import HealthSummary from "./HealthSummary";
import { calculateAge, formatDateTime, normalizeList } from "../../lib/patient";

export default function DashboardOverview({ patient }) {
  const age = calculateAge(patient?.dob);
  const prescriptions = normalizeList(patient?.admin?.prescriptions);
  const labReports = normalizeList(patient?.diagnostics?.labReports);
  const medicalDocuments = normalizeList(patient?.admin?.medicalDocuments);
  const reminders = normalizeList(patient?.diagnostics?.immunizationReminders);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-emerald-300">
              Medical Dashboard
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {patient?.name || "Patient overview"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              A clean snapshot of your profile details, care plan, reports, and upcoming follow-up.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {patient?.uid && (
              <Badge className="border-blue-200 bg-blue-100 font-mono text-blue-700 dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300">
                {patient.uid}
              </Badge>
            )}
            <Badge>{patient?.bloodGroup || "Blood group pending"}</Badge>
            <Badge className="border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
              {age ? `${age} years old` : "Age unavailable"}
            </Badge>
            <Badge className="border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {patient?.gender || "Gender unavailable"}
            </Badge>
          </div>
        </div>
      </Card>

      <HealthSummary patient={patient} />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Section
          title="Next appointment"
          description="Your nearest scheduled visit and care note."
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-emerald-500/12 dark:text-emerald-200">
                <CalendarClock size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatDateTime(patient?.admin?.nextAppointment)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {patient?.admin?.doctorNotes || "No doctor notes available yet."}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Emergency contact
              </p>
              <p className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
                {patient?.emergencyContact?.name || "Not added"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {patient?.emergencyContact?.phone || "No phone number saved"}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Account
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{patient?.name || "Patient"}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{patient?.email || "Email unavailable"}</p>
                  {patient?.uid && <p className="mt-1 text-xs font-mono font-semibold text-blue-500 dark:text-emerald-400">{patient.uid}</p>}
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Section
          title="Prescriptions"
          description="Current instructions from your care team."
        >
          {prescriptions.length ? (
            <div className="space-y-3">
              {prescriptions.map((prescription, index) => (
                <div
                  key={`${prescription}-${index}`}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/12 dark:text-emerald-200">
                    <Pill size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Prescription {index + 1}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{prescription}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              No active prescriptions available right now.
            </div>
          )}
        </Section>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Section
          title="Records Overview"
          description="Quick access to the records you are most likely to revisit."
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Lab reports
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {labReports.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Documents
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {medicalDocuments.length}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Reminders
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {reminders.length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="../diagnostics"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              <FileText size={16} />
              Open diagnostics
            </Link>

            <Link
              to="../current-health"
              className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              View current health
            </Link>
          </div>
        </Section>

        <Section
          title="Immunization Reminders"
          description="Important reminders that should stay visible between visits."
        >
          {reminders.length ? (
            <div className="flex flex-wrap gap-2">
              {reminders.map((reminder) => (
                <Badge
                  key={reminder}
                  className="border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                >
                  {reminder}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              No immunization reminders are available right now.
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
