import { CalendarClock, FileHeart, Pill, UserRound } from "lucide-react";

import MetricCard from "./MetricCard";
import { calculateAge, formatDate, normalizeList } from "../../lib/patient";

export default function HealthSummary({ patient }) {
  const age = calculateAge(patient?.dob);
  const medications = normalizeList(patient?.currentHealth?.medications);
  const allergies = normalizeList(patient?.medicalHistory?.allergies);
  const emergencyContact = patient?.emergencyContact;
  const firstMedication = medications[0];
  const firstAllergy = allergies[0];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        icon={CalendarClock}
        label="Date of Birth"
        value={formatDate(patient?.dob)}
        helper={age ? `${age} years old` : "Age not available"}
      />
      <MetricCard
        icon={UserRound}
        label="Emergency Contact"
        value={emergencyContact?.name || "Not added"}
        helper={
          emergencyContact?.phone ||
          emergencyContact?.relation ||
          "Add a trusted contact"
        }
        accent="bg-rose-50 text-rose-600"
      />
      <MetricCard
        icon={Pill}
        label="Medications"
        value={medications.length ? `${medications.length} listed` : "None added"}
        helper={
          firstMedication?.name ||
          firstMedication?.dosage ||
          "Current treatment list"
        }
        accent="bg-amber-50 text-amber-600"
      />
      <MetricCard
        icon={FileHeart}
        label="Allergy Alerts"
        value={allergies.length ? `${allergies.length} recorded` : "None recorded"}
        helper={firstAllergy || "No allergy alerts on file"}
        accent="bg-emerald-50 text-emerald-600"
      />
    </div>
  );
}
