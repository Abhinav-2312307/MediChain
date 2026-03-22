import { useState } from "react";
import { updatePatientProfile } from "../../api/patientApi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

export default function EditProfileModal({ patient, close, onSaved }) {
  const [form, setForm] = useState({
    phone: patient?.phone || "",
    address: patient?.address || "",
    bloodGroup: patient?.bloodGroup || "",
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

      const updatedPatient = await updatePatientProfile(body);
      if (updatedPatient && onSaved) {
        onSaved(updatedPatient);
      }
      close();
    } catch {
      setError("Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title="Edit Profile" onClose={close}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {profilePic ? (
              <img
                src={URL.createObjectURL(profilePic)}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : patient?.profilePic ? (
              <img src={patient.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="text-lg font-semibold text-gray-500">{patient?.name?.[0] || "P"}</div>
            )}
          </div>

          <label className="text-sm text-slate-700 dark:text-slate-200">
            <span className="cursor-pointer text-blue-600 hover:underline">Change profile picture</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0] || null;
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

        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(event) => setForm({ ...form, phone: event.target.value })}
        />

        <Input
          placeholder="Address"
          value={form.address}
          onChange={(event) => setForm({ ...form, address: event.target.value })}
        />

        <Input
          placeholder="Blood Group"
          value={form.bloodGroup}
          onChange={(event) => setForm({ ...form, bloodGroup: event.target.value })}
        />

        {fileError ? <div className="text-sm text-red-600">{fileError}</div> : null}
        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={saving || !!fileError}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="secondary" onClick={close}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
}
