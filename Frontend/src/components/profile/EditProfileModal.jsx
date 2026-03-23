import { useEffect, useState } from "react";

import { selectPatientError, selectPatientLoading } from "../../features/patient/patientSelectors";
import { updatePatientProfile } from "../../features/patient/patientThunks";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

export default function EditProfileModal({ patient, close, onSaved }) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(selectPatientLoading);
  const requestError = useAppSelector(selectPatientError);
  const [form, setForm] = useState({
    phone: patient?.phone || "",
    address: patient?.address || "",
    bloodGroup: patient?.bloodGroup || "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [didSubmit, setDidSubmit] = useState(false);
  const [fileError, setFileError] = useState("");

  useEffect(() => {
    if (!profilePic) {
      setPreviewUrl("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(profilePic);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [profilePic]);

  const handleSubmit = async () => {
    setDidSubmit(true);

    try {
      const body = new FormData();
      body.append("phone", form.phone);
      body.append("address", form.address);
      body.append("bloodGroup", form.bloodGroup);

      if (profilePic) {
        body.append("profilePic", profilePic);
      }

      const updatedPatient = await dispatch(updatePatientProfile(body)).unwrap();

      if (onSaved) {
        onSaved(updatedPatient);
      } else {
        close();
      }
    } catch {
      // Slice state already contains the backend error message.
    }
  };

  return (
    <Modal title="Edit Profile" onClose={close}>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : patient?.profilePic ? (
              <img src={patient.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="text-lg font-semibold text-gray-500">{patient?.name?.[0] || "P"}</div>
            )}
          </div>

          <label className="text-sm text-slate-700 dark:text-slate-200">
            <span className="cursor-pointer text-blue-600 hover:underline">
              Change profile picture
            </span>
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
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              phone: event.target.value,
            }))
          }
        />

        <Input
          placeholder="Address"
          value={form.address}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              address: event.target.value,
            }))
          }
        />

        <Input
          placeholder="Blood Group"
          value={form.bloodGroup}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              bloodGroup: event.target.value,
            }))
          }
        />

        {fileError ? <div className="text-sm text-red-600">{fileError}</div> : null}
        {didSubmit && requestError ? <div className="text-sm text-red-600">{requestError}</div> : null}

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={saving || Boolean(fileError)}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
