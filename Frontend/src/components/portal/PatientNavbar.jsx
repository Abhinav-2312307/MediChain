import { LogOut } from "lucide-react";

export default function PatientNavbar({ patient }) {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">
        Welcome, {patient?.name || "Patient"}
      </h1>

      <button className="flex items-center gap-2 text-red-500">
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
}