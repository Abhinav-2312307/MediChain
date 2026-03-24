import Badge from "../ui/Badge";
import Section from "../ui/Section";
import { formatField, normalizeList } from "../../lib/patient";

export default function MedicalHistoryCard({ patient }) {
  const history = patient?.medicalHistory;
  const conditions = normalizeList(history?.healthConditions);
  const allergies = normalizeList(history?.allergies);
  const surgeries = normalizeList(history?.surgicalProcedures);
  const vaccinations = normalizeList(history?.vaccinationRecords);
  const hospitalizations = normalizeList(history?.pastHospitalizations);

  const chipGroups = [
    { title: "Surgical procedures", values: surgeries },
    { title: "Health conditions", values: conditions },
    { title: "Allergies", values: allergies },
    { title: "Vaccination records", values: vaccinations },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Section
          title="Medical history"
          description="An organized view of major historical records and known conditions."
        >
          <div className="grid gap-5">
            {chipGroups.map((group) => (
              <div key={group.title}>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{group.title}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.values.length ? (
                    group.values.map((item) => <Badge key={item}>{item}</Badge>)
                  ) : (
                    <span className="text-sm text-slate-500 dark:text-slate-400">No records added.</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          title="Additional notes"
          description="Supporting context from your lifestyle and organ health history."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Alcohol or smoking
              </p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                {formatField(history?.alcoholOrSmoking, "No lifestyle notes added.")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Organ health
              </p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                {formatField(history?.organHealth, "No organ health notes added.")}
              </p>
            </div>
          </div>
        </Section>
      </div>

      <Section
        title="Past hospitalizations"
        description="Documented stays, reasons, and durations."
      >
        {hospitalizations.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hospitalizations.map((entry, index) => (
              <div
                key={`${entry?.reason || "hospitalization"}-${index}`}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {entry?.reason || "Hospitalization"}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {entry?.hospitalName || "Hospital name not recorded"}
                </p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Duration: {entry?.duration || "Not specified"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
            No hospitalizations have been recorded yet.
          </div>
        )}
      </Section>
    </div>
  );
}
