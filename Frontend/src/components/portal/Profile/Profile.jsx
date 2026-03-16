import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

export default function Profile({ patient, setPatient }) {
  const [open, setOpen] = useState(false);

  if (!patient) {
    return (
      <div className="p-6 text-gray-500">
        Loading patient data...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {patient?.profilePic ? (
              <img
                src={patient.profilePic}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-xl font-semibold text-gray-500">
                {patient?.name?.[0] || "P"}
              </div>
            )}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100">
              Patient Profile
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Keep your details up to date
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700 dark:text-slate-200">
        <p>
          <span className="font-semibold">Name:</span> {patient?.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {patient?.email}
        </p>

        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {patient?.phone || "Not set"}
        </p>

        <p>
          <span className="font-semibold">Blood Group:</span>{" "}
          {patient?.bloodGroup || "Not set"}
        </p>

        <p className="sm:col-span-2">
          <span className="font-semibold">Address:</span>{" "}
          {patient?.address || "Not set"}
        </p>
      </div>

      {open && (
        <EditProfileModal
          patient={patient}
          close={() => setOpen(false)}
          onSaved={(updated) => {
            if (updated && setPatient) setPatient(updated);
          }}
        />
      )}
    </div>
  );
}
