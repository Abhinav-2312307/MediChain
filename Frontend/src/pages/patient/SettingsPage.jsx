import { LogOut, Settings as SettingsIcon, ShieldAlert, User } from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth } from "../../firebase";

import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Section from "../../components/ui/Section";
import { logout } from "../../features/auth/authSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth).catch(() => {});
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <Section title="Profile Settings" icon={User}>
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Personal Information</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Update your photo and personal details.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" onClick={() => navigate("../profile")}>
            Edit Profile
          </Button>
        </Card>
      </Section>

      <Section title="Emergency Contact" icon={ShieldAlert}>
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Emergency Support</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage who to contact in an emergency.
            </p>
          </div>
          <Button className="mt-4 sm:mt-0" variant="secondary" onClick={() => navigate("../profile")}>
            Update Contact
          </Button>
        </Card>
      </Section>

      <Section title="Account Actions" icon={SettingsIcon}>
        <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-red-100 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10">
          <div>
            <h3 className="font-semibold text-red-700 dark:text-red-400">Log Out</h3>
            <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
              Sign out of your account on this device.
            </p>
          </div>
          <Button variant="danger" onClick={handleLogout} className="mt-4 sm:mt-0 sm:ml-auto">
            Sign out
          </Button>
        </Card>
      </Section>
    </div>
  );
}
