import { useState } from "react";
import axios from "axios";

export default function EditProfileModal({ patient, close, onSaved }) {
  const [form, setForm] = useState({
    phone: patient.phone || "",
    address: patient.address || "",
    bloodGroup: patient.bloodGroup || "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const body = new FormData();
      body.append("phone", form.phone);
      body.append("address", form.address);
      body.append("bloodGroup", form.bloodGroup);
      if (profilePic) body.append("profilePic", profilePic);

      const res = await axios.put(
        `${import.meta.env.VITE_Backend_API_URL}/patient/update`,
        body,
        { withCredentials: true }
      );

      const updatedPatient = res?.data?.patient;
      if (updatedPatient) {
        try {
          localStorage.setItem(
            "medivault_patient_cache_v1",
            JSON.stringify({ data: updatedPatient, ts: Date.now() })
          );
        } catch {
          // ignore cache write errors
        }
        if (onSaved) onSaved(updatedPatient);
      }
      close();
    } catch (err) {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl w-full max-w-md space-y-4 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Edit Profile
          </h2>
          <button
            onClick={close}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : patient?.profilePic ? (
              <img
                src={patient.profilePic}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-lg font-semibold text-gray-500">
                {patient?.name?.[0] || "P"}
              </div>
            )}
          </div>
          <label className="text-sm text-slate-700 dark:text-slate-200">
            <span className="text-blue-600 hover:underline cursor-pointer">
              Change profile picture
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                if (file && file.size > 2 * 1024 * 1024) {
                  setFileError("Max file size is 2MB.");
                  setProfilePic(null);
                  return;
                }
                setFileError("");
                setProfilePic(file);
              }}
            />
          </label>
        </div>

        <input
          placeholder="Phone"
          className="border border-slate-200 dark:border-slate-800 p-2 w-full rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="Address"
          className="border border-slate-200 dark:border-slate-800 p-2 w-full rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <input
          placeholder="Blood Group"
          className="border border-slate-200 dark:border-slate-800 p-2 w-full rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          value={form.bloodGroup}
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
        />

        {fileError && <div className="text-sm text-red-600">{fileError}</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={saving || !!fileError}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={close}
            className="bg-gray-200 px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
