import Button from "../ui/Button";
import Card from "../ui/Card";
import Section from "../ui/Section";
import {
  calculateAge,
  formatDate,
  formatField,
  getInitials,
} from "../../lib/patient";

function InfoItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {label}
      </p>
      <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

export default function ProfileDetails({ patient, onEdit, onLogout }) {
  if (!patient) {
    return <Card className="text-slate-500 dark:text-slate-400">Loading patient data...</Card>;
  }

  const age = calculateAge(patient?.dob);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-lg font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
              {patient?.profilePic ? (
                <img src={patient.profilePic} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                getInitials(patient?.name)
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500 dark:text-emerald-300">
                Profile
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-slate-100">
                {patient?.name || "Patient"}
              </h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                {patient?.email || "Email unavailable"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={onEdit}>Edit profile</Button>
            {onLogout ? (
              <Button variant="danger" onClick={onLogout}>
                Logout
              </Button>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <Section
          title="Basic information"
          description="Core demographic details used across the patient portal."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoItem label="Date of birth" value={formatDate(patient?.dob)} />
            <InfoItem label="Gender" value={formatField(patient?.gender)} />
            <InfoItem label="Age" value={age ? `${age} years` : "Not provided"} />
            <InfoItem label="Blood group" value={formatField(patient?.bloodGroup)} />
          </div>
        </Section>

        <Section
          title="Contact details"
          description="The information your care team can reach you through."
        >
          <div className="space-y-4">
            <InfoItem label="Phone" value={formatField(patient?.phone)} />
            <InfoItem label="Address" value={formatField(patient?.address)} />
          </div>
        </Section>
      </div>

      <Section
        title="Emergency contact"
        description="Saved contact information for urgent communication."
      >
        <div className="grid gap-4 md:grid-cols-3">
          <InfoItem label="Name" value={formatField(patient?.emergencyContact?.name)} />
          <InfoItem label="Relation" value={formatField(patient?.emergencyContact?.relation)} />
          <InfoItem label="Phone" value={formatField(patient?.emergencyContact?.phone)} />
        </div>
      </Section>
    </div>
  );
}
