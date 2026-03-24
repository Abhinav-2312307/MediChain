import { useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate, useOutletContext } from "react-router-dom";

import EditProfileModal from "../../components/profile/EditProfileModal";
import ProfileDetails from "../../components/profile/ProfileDetails";
import { auth } from "../../firebase";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { patient } = useOutletContext();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth).catch(() => {});
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <ProfileDetails
        patient={patient}
        onEdit={() => setOpen(true)}
        onLogout={handleLogout}
      />
      {open ? (
        <EditProfileModal patient={patient} close={() => setOpen(false)} onSaved={() => setOpen(false)} />
      ) : null}
    </>
  );
}
