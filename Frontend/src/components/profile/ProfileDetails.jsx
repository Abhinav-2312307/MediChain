import Card from "../ui/Card";

export default function ProfileDetails({ patient, onEdit }) {
  if (!patient) {
    return <Card className="text-slate-500 dark:text-slate-400">Loading patient data...</Card>;
  }

  return (
    <Card className="max-w-5xl rounded-2xl">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {patient?.profilePic ? (
              <img src={patient.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="text-xl font-semibold text-gray-500">{patient?.name?.[0] || "P"}</div>
            )}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
              Patient Profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keep your details up to date
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 text-slate-700 dark:text-slate-200 sm:grid-cols-2">
        <p><span className="font-semibold">Name:</span> {patient?.name}</p>
        <p><span className="font-semibold">Email:</span> {patient?.email}</p>
        <p><span className="font-semibold">Phone:</span> {patient?.phone || "Not set"}</p>
        <p><span className="font-semibold">Blood Group:</span> {patient?.bloodGroup || "Not set"}</p>
        <p className="sm:col-span-2"><span className="font-semibold">Address:</span> {patient?.address || "Not set"}</p>
      </div>
    </Card>
  );
}
