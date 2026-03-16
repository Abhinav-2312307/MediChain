export default function HealthSummary({ patient }) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Health Summary
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
  );
}
