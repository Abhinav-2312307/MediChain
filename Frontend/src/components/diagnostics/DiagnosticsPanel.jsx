import Card from "../ui/Card";

export default function DiagnosticsPanel({ patient }) {
  const diagnostics = patient?.diagnostics;
  const reports = diagnostics?.labReports || [];

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Diagnostics
      </h2>

      <p className="text-slate-700 dark:text-slate-200">
        <b>Liver:</b> {diagnostics?.organFunction?.liver || "Normal"}
      </p>

      <p className="mt-3 text-slate-700 dark:text-slate-200">
        <b>Kidney:</b> {diagnostics?.organFunction?.kidney || "Normal"}
      </p>

      <div className="mt-4">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">Lab Reports</h3>
        <div className="mt-2 space-y-2">
          {reports.length ? (
            reports.map((report, index) => (
              <a
                key={`${report}-${index}`}
                href={report}
                target="_blank"
                rel="noreferrer"
                className="block text-blue-600 dark:text-blue-400"
              >
                Report {index + 1}
              </a>
            ))
          ) : (
            <p className="text-slate-700 dark:text-slate-200">No reports available.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
