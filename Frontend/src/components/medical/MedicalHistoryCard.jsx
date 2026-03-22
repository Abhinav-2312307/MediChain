import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function MedicalHistoryCard({ patient }) {
  const history = patient?.medicalHistory;
  const conditions = history?.healthConditions || [];
  const allergies = history?.allergies || [];
  const surgeries = history?.surgicalProcedures || [];

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Medical History
      </h2>

      <div className="space-y-4 text-slate-700 dark:text-slate-200">
        <div>
          <p className="mb-2 font-semibold">Conditions</p>
          <div className="flex flex-wrap gap-2">
            {conditions.length ? conditions.map((item) => <Badge key={item}>{item}</Badge>) : <span>None</span>}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold">Allergies</p>
          <div className="flex flex-wrap gap-2">
            {allergies.length ? allergies.map((item) => <Badge key={item}>{item}</Badge>) : <span>None</span>}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold">Surgical Procedures</p>
          <div className="flex flex-wrap gap-2">
            {surgeries.length ? surgeries.map((item) => <Badge key={item}>{item}</Badge>) : <span>None</span>}
          </div>
        </div>
      </div>
    </Card>
  );
}
