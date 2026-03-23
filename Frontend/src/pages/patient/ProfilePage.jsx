import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import EditProfileModal from "../../components/profile/EditProfileModal";
import ProfileDetails from "../../components/profile/ProfileDetails";

export default function ProfilePage() {
  const { patient } = useOutletContext();
  const [open, setOpen] = useState(false);

  return (
    <>
      <ProfileDetails patient={patient} onEdit={() => setOpen(true)} />
      {open ? (
        <EditProfileModal patient={patient} close={() => setOpen(false)} onSaved={() => setOpen(false)} />
      ) : null}
    </>
  );
}
