export default function Diagnostics({ patient }) {
  const diag = patient?.diagnostics;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Diagnostics
      </h2>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Liver:</b> {diag?.organFunction?.liver || "Normal"}
      </p>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Kidney:</b> {diag?.organFunction?.kidney || "Normal"}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
          Lab Reports
        </h3>

        {diag?.labReports?.map((report, i) => (
          <a
            key={i}
            href={report}
            target="_blank"
            className="text-blue-600 dark:text-blue-400 block"
          >
            Report {i + 1}
          </a>
        ))}
      </div>
    </div>
  );
}
