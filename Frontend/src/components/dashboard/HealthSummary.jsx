import Card from "../ui/Card";

export default function HealthSummary({ patient }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Health Summary
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Heart Rate</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {patient?.diagnostics?.vitalSigns?.heartRate || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">Blood Pressure</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {patient?.diagnostics?.vitalSigns?.bloodPressure || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 dark:text-slate-400">BMI</p>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {patient?.diagnostics?.vitalSigns?.bmi || "N/A"}
          </p>
        </div>
      </div>
    </Card>
  );
}
