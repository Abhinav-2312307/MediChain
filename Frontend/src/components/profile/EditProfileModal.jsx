import { useEffect, useState } from "react";

import { selectPatientError, selectPatientLoading } from "../../features/patient/patientSelectors";
import { updatePatientProfile } from "../../features/patient/patientThunks";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

function Field({ label, children }) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700 dark:text-slate-300">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function EditProfileModal({ patient, close, onSaved }) {
  const dispatch = useAppDispatch();
  const saving = useAppSelector(selectPatientLoading);
  const requestError = useAppSelector(selectPatientError);
  const [form, setForm] = useState({
    phone: patient?.phone || "",
    address: patient?.address || "",
    bloodGroup: patient?.bloodGroup || "",
    emergencyContactName: patient?.emergencyContact?.name || "",
    emergencyContactRelation: patient?.emergencyContact?.relation || "",
    emergencyContactPhone: patient?.emergencyContact?.phone || "",
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
      body.append("emergencyContactName", form.emergencyContactName);
      body.append("emergencyContactRelation", form.emergencyContactRelation);
      body.append("emergencyContactPhone", form.emergencyContactPhone);

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
    <Modal
      title="Edit profile"
      description="Update the contact information shown throughout your patient portal."
      onClose={close}
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            ) : patient?.profilePic ? (
              <img src={patient.profilePic} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="text-lg font-semibold text-gray-500 dark:text-slate-300">{patient?.name?.[0] || "P"}</div>
            )}
          </div>

          <label className="text-sm text-slate-700 dark:text-slate-300">
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

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone">
            <Input
              placeholder="Phone number"
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
            />
          </Field>

          <Field label="Blood group">
            <Input
              placeholder="Blood group"
              value={form.bloodGroup}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  bloodGroup: event.target.value,
                }))
              }
            />
          </Field>
        </div>

        <Field label="Address">
          <Input
            placeholder="Street, city, state"
            value={form.address}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                address: event.target.value,
              }))
            }
          />
        </Field>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Emergency contact</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Field label="Name">
              <Input
                placeholder="Contact name"
                value={form.emergencyContactName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    emergencyContactName: event.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Relation">
              <Input
                placeholder="Relation"
                value={form.emergencyContactRelation}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    emergencyContactRelation: event.target.value,
                  }))
                }
              />
            </Field>

            <Field label="Phone">
              <Input
                placeholder="Emergency phone"
                value={form.emergencyContactPhone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    emergencyContactPhone: event.target.value,
                  }))
                }
              />
            </Field>
          </div>
        </div>

        {fileError ? <div className="text-sm text-red-600 dark:text-rose-300">{fileError}</div> : null}
        {didSubmit && requestError ? <div className="text-sm text-red-600 dark:text-rose-300">{requestError}</div> : null}

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={saving || Boolean(fileError)}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
