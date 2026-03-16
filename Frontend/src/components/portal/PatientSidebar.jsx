import { User, Activity, FileText, Heart, MessageCircle } from "lucide-react"

const PatientSidebar = ({ activeTab, setActiveTab }) => {

  const items = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "profile", label: "Profile", icon: User },
    { id: "history", label: "Medical History", icon: FileText },
    { id: "health", label: "Current Health", icon: Heart },
    { id: "diagnostics", label: "Diagnostics", icon: Activity },
    { id: "chat", label: "Doctor Chat", icon: MessageCircle },
  ]

  return (
    <div className="w-20 sm:w-64 shrink-0 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800">
      <div className="p-4 sm:p-6 text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
        <span className="hidden sm:inline">MediVault</span>
        <span className="sm:hidden">MV</span>
      </div>

      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`flex items-center gap-3 w-full px-4 py-3 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 ${
            activeTab === item.id ? "bg-slate-100 dark:bg-slate-900 font-medium" : ""
          }`}
        >
          <item.icon size={18} />
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </div>
  )
}

export default PatientSidebar
