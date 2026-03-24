import Badge from "../ui/Badge";
import Section from "../ui/Section";
import { formatField, normalizeList } from "../../lib/patient";

export default function CurrentHealthCard({ patient }) {
  const health = patient?.currentHealth;
  const medications = normalizeList(health?.medications);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Section
          title="Current health"
          description="Lifestyle and wellness information captured in your profile."
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Exercise routine
              </p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                {formatField(health?.exerciseRoutine, "No exercise routine added.")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Mental health status
              </p>
              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
                {formatField(health?.mentalHealthStatus, "No mental health note added.")}
              </p>
            </div>
          </div>
        </Section>

        <Section
          title="Medications"
          description="Current prescriptions and recommended timing."
        >
          {medications.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {medications.map((medication, index) => (
                <div
                  key={`${medication?.name || "medication"}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {medication?.name || "Medication"}
                      </p>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                        {medication?.dosage || "Dosage not specified"}
                      </p>
                    </div>
                    <Badge className="border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      {medication?.timing || "Timing TBD"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
              No medications have been added yet.
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}
