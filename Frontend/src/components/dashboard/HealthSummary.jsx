import { AlertCircle, CalendarClock, ActivitySquare, Pill } from "lucide-react";

import MetricCard from "./MetricCard";
import { formatDateTime, normalizeList } from "../../lib/patient";

export default function HealthSummary({ patient }) {
  const medications = normalizeList(patient?.currentHealth?.medications);
  const conditions = normalizeList(patient?.medicalHistory?.healthConditions);
  const allergies = normalizeList(patient?.medicalHistory?.allergies);
  
  const firstMedication = medications[0]?.name || "Current treatment list";
  const firstCondition = conditions[0]?.condition || "Active condition tracking";
  const firstAllergy = allergies[0]?.allergen || "No allergy alerts on file";

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={Pill}
        label="Medications"
        value={medications.length ? `${medications.length} active` : "None recorded"}
        helper={firstMedication}
        accent="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
      />
      <MetricCard
        icon={ActivitySquare}
        label="Active Conditions"
        value={conditions.length ? `${conditions.length} current` : "None recorded"}
        helper={firstCondition}
        accent="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300"
      />
      <MetricCard
        icon={AlertCircle}
        label="Allergy Alerts"
        value={allergies.length ? `${allergies.length} recorded` : "None recorded"}
        helper={firstAllergy}
        accent="bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
      />
      <MetricCard
        icon={CalendarClock}
        label="Next Appointment"
        value={formatDateTime(patient?.admin?.nextAppointment) || "Not Scheduled"}
        helper={patient?.admin?.nextAppointment ? "With primary doctor" : "Book an appointment"}
        accent="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"
      />
    </div>
  );
}
