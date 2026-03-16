import HealthSummary from "./HealthSummary";

export default function Dashboard({ patient }) {
  return (
    <div className="space-y-6">
      <HealthSummary patient={patient} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Next Appointment</h3>
          <p className="text-slate-600 dark:text-slate-300">
            {patient?.admin?.nextAppointment || "No appointment"}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Blood Group</h3>
          <p className="text-slate-600 dark:text-slate-300">
            {patient?.bloodGroup || "Not set"}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100">Allergies</h3>
          <p className="text-slate-600 dark:text-slate-300">
            {patient?.medicalHistory?.allergies?.join(", ") || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
