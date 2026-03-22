import Card from "../ui/Card";
import HealthSummary from "./HealthSummary";

export default function DashboardOverview({ patient }) {
  return (
    <div className="space-y-6">
      <HealthSummary patient={patient} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 sm:gap-6">
        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Next Appointment
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            {patient?.admin?.nextAppointment || "No appointment"}
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Blood Group
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            {patient?.bloodGroup || "Not set"}
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">
            Allergies
          </h3>
          <p className="text-slate-600 dark:text-slate-300">
            {patient?.medicalHistory?.allergies?.join(", ") || "None"}
          </p>
        </Card>
      </div>
    </div>
  );
}
