export default function MedicalHistory({ patient }) {
  const history = patient?.medicalHistory;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Medical History
      </h2>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Conditions:</b> {history?.healthConditions?.join(", ") || "None"}
      </p>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Allergies:</b> {history?.allergies?.join(", ") || "None"}
      </p>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Surgical Procedures:</b>{" "}
        {history?.surgicalProcedures?.join(", ") || "None"}
      </p>
    </div>
  );
}
