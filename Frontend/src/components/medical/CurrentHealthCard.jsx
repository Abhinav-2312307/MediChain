import Card from "../ui/Card";

export default function CurrentHealthCard({ patient }) {
  const health = patient?.currentHealth;
  const medications = health?.medications || [];

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Current Health
      </h2>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Exercise Routine:</b> {health?.exerciseRoutine || "None"}
      </p>

      <p className="mt-3 text-slate-700 dark:text-slate-200">
        <b>Mental Health:</b> {health?.mentalHealthStatus || "Normal"}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Medications</h3>
        <div className="mt-2 space-y-2">
          {medications.length ? (
            medications.map((medication, index) => (
              <div
                key={`${medication.name || "med"}-${index}`}
                className="rounded-lg border border-slate-200 p-3 text-slate-700 dark:border-slate-800 dark:text-slate-200"
              >
                <p>{medication.name}</p>
                <p>{medication.dosage}</p>
                <p>{medication.timing}</p>
              </div>
            ))
          ) : (
            <p className="text-slate-700 dark:text-slate-200">No medications listed.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
