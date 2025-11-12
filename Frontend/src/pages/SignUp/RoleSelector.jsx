import { User, Hospital, BriefcaseMedical } from "lucide-react";

export default function RoleSelector({ role, setRole }) {
  const roles = [
    { key: "patient", icon: <User size={28} />, label: "Patient" },
    { key: "doctor", icon: <BriefcaseMedical size={28} />, label: "Doctor" },
    { key: "hospital", icon: <Hospital size={28} />, label: "Hospital" },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {roles.map((r) => (
        <div
          key={r.key}
          onClick={() => setRole(r.key)}
          className={`cursor-pointer text-center p-6 rounded-xl border transition-all duration-300 transform ${
            role === r.key
              ? "bg-blue-100 border-blue-500 scale-110 shadow-md"
              : "bg-white/10 border-transparent hover:bg-white/20 hover:scale-105"
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="text-blue-600">{r.icon}</div>
            <h3 className="font-semibold text-sm text-gray-800">{r.label}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
