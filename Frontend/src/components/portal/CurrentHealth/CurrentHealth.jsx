export default function CurrentHealth({ patient }) {
  const health = patient?.currentHealth;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Current Health
      </h2>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Exercise Routine:</b> {health?.exerciseRoutine || "None"}
      </p>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Mental Health:</b> {health?.mentalHealthStatus || "Normal"}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Medications
        </h3>

        {health?.medications?.map((med, i) => (
          <div
            key={i}
            className="border border-slate-200 dark:border-slate-800 p-2 rounded mt-2 text-slate-700 dark:text-slate-200"
          >
            <p>{med.name}</p>
            <p>{med.dosage}</p>
            <p>{med.timing}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
