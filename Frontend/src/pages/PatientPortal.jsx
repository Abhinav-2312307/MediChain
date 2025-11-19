import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Classic } from "@theme-toggles/react";
import "@theme-toggles/react/css/Classic.css";
import {
  LogOut,
  User,
  ChevronDown,
  X,
  Save,
  Phone,
  MapPin,
  HeartPulse,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import { useTheme } from "../context/ThemeContext";
import usePatientStore from "../Store/PatientStore";
import { DEFAULT_AVATAR, GLASS_CLASSES } from "../components/portal/utils";
import { LeftPanel, RightPanel } from "../components/portal/SidePanels";
import CenterViewport from "../components/portal/CenterViewport";

// --- Helper Component for Settings Input Fields ---
const SettingField = ({
  label,
  name,
  value,
  onChange,
  icon: Icon,
  disabled = false,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {label}
    </label>
    <div
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-colors ${
        disabled
          ? "bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-500 cursor-not-allowed"
          : "bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50"
      }`}
    >
      {Icon && (
        <Icon
          className={`w-4 h-4 ${
            disabled ? "text-slate-400" : "text-indigo-500"
          }`}
        />
      )}
      <input
        type="text"
        name={name}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className="bg-transparent w-full text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none disabled:cursor-not-allowed"
      />
      {disabled && (
        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-500">
          LOCKED
        </span>
      )}
    </div>
  </div>
);

export default function PatientPortal() {
  const { patientData } = usePatientStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // UI State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // New state to delay 3D rendering until layout is stable
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Patient Data State (With LocalStorage Persistence)
  const [patient, setPatient] = useState(() => {
    try {
      const saved = localStorage.getItem("patient_profile_data");
      return saved ? JSON.parse(saved) : patientData || getDefaultPatient();
    } catch (e) {
      return patientData || getDefaultPatient();
    }
  });

  // Helper to get default empty structure
  function getDefaultPatient() {
    return {
      profilePic: DEFAULT_AVATAR,
      name: "Unknown Patient",
      uid: "—",
      email: "—",
      gender: "—",
      dob: null,
      diagnostics: {
        vitalSigns: {
          bloodPressure: "—",
          heartRate: "—",
          bmi: "—",
          sugarLevels: "—",
        },
        organFunction: { liver: "—", kidney: "—", others: "—" },
      },
      currentHealth: {
        mentalHealthStatus: "No data available",
        exerciseRoutine: "Not set",
        medications: [],
      },
      medicalHistory: {
        organHealth: "—",
        surgicalProcedures: [],
        healthConditions: [],
        allergies: [],
        vaccinationRecords: [],
      },
      phone: "—",
      emergencyContact: { name: "", relation: "", phone: "" },
      address: "—",
      admin: { nextAppointment: null, insuranceDetails: "—" },
    };
  }

  // Settings Form State
  const [formData, setFormData] = useState({});

  useEffect(() => {
    toast.success("Welcome to the Portal!");
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOADING & LAYOUT STABILIZATION LOGIC ---
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    // 1. Fake loading delay
    setTimeout(() => {
      if (mounted) {
        setLoading(false);
        // 2. Delay enabling 3D view until after layout stabilizes
        // This ensures the grid has calculated the exact pixels, preventing the "zoomed in" glitch.
        // Adarsh If u r reading this wait , i need to fix here a bit
        setTimeout(() => {
          if (mounted) setIsLayoutReady(true);
        }, 150);
      }
    }, 500);

    return () => (mounted = false);
  }, []);

  const openSettings = () => {
    setFormData({
      phone: patient.phone,
      address: patient.address,
      ecName: patient.emergencyContact?.name || "",
      ecRelation: patient.emergencyContact?.relation || "",
      ecPhone: patient.emergencyContact?.phone || "",
    });
    setIsMenuOpen(false);
    setIsSettingsOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = () => {
    const updated = {
      ...patient,
      phone: formData.phone,
      address: formData.address,
      emergencyContact: {
        ...patient.emergencyContact,
        name: formData.ecName,
        relation: formData.ecRelation,
        phone: formData.ecPhone,
      },
    };
    setPatient(updated);
    localStorage.setItem("patient_profile_data", JSON.stringify(updated));
    toast.success("Profile updated successfully!");
    setIsSettingsOpen(false);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  let bodyPercent = 80;
  if (patient?.diagnostics?.vitalSigns?.bmi) {
    const bmi = parseFloat(patient.diagnostics.vitalSigns.bmi);
    if (isFinite(bmi))
      bodyPercent = Math.max(
        30,
        Math.min(98, Math.round(100 - Math.abs(22 - bmi) * 4))
      );
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950 transition-colors duration-300">
        <div className={`${GLASS_CLASSES} p-6`}>
          Loading patient dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#e8efff] to-[#e6eefc] dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden">
      {/* --- NAVBAR --- */}
      <div className="flex-none h-16 px-6 flex items-center justify-between border-b border-white/20 dark:border-white/5 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md z-40 relative">
        <div className="flex items-center gap-8">
          <div className="font-black text-xl text-indigo-600 dark:text-indigo-400 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7" />
            MediChain
          </div>
          <div className="hidden md:flex gap-1 bg-white/40 dark:bg-black/20 p-1 rounded-xl border border-white/10">
            {["overview", "timeline", "allergies"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <Classic
            duration={750}
            toggled={isDark}
            className="text-orange-500 dark:text-yellow-400 text-4xl"
            onClick={toggleTheme}
          />

          <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-1 hidden sm:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <div
              className="flex items-center gap-3 cursor-pointer p-1.5 pr-3 rounded-xl hover:bg-white/20 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                  {patient.name.split(" ")[0]}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
                  {patient.uid}
                </div>
              </div>
              <img
                src={patient.profilePic || DEFAULT_AVATAR}
                alt="avatar"
                className="w-9 h-9 rounded-lg object-cover border-2 border-white dark:border-slate-600 shadow-sm"
              />
              <ChevronDown
                className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl p-2 z-50"
                >
                  <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700/50 mb-1">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {patient.email}
                    </p>
                  </div>

                  <button
                    onClick={openSettings}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-lg transition-colors text-left"
                  >
                    <User className="w-4 h-4" /> Profile Settings
                  </button>

                  <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Log Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 p-4 min-h-0 relative z-0">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr 360px",
            gap: 18,
            height: "calc(100vh - 100px)",
          }}
        >
          {/* Left Column */}
          <div className="overflow-y-auto pr-1 custom-scrollbar">
            <LeftPanel patient={patient} bodyPercent={bodyPercent} />
          </div>

          {/* Center Column (3D Canvas) */}
          <div className="h-full min-h-0 relative rounded-2xl overflow-hidden">
            {/* Conditionally render CenterViewport only after layout is stable */}
            {isLayoutReady && (
              <CenterViewport patient={patient} activeTab={activeTab} />
            )}
          </div>

          {/* Right Column */}
          <div className="overflow-y-auto pl-1 custom-scrollbar">
            <RightPanel patient={patient} />
          </div>
        </div>
      </div>

      {/* --- SETTINGS MODAL --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setIsSettingsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-slate-900 border border-white/20 dark:border-slate-700 rounded-2xl shadow-2xl z-[70] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Profile Settings
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Update your personal details
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                {/* Read-Only Identity */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">
                      Identity (Read Only)
                    </span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <SettingField
                      label="Full Name"
                      value={patient.name}
                      disabled={true}
                      icon={User}
                    />
                    <SettingField
                      label="Patient ID"
                      value={patient.uid}
                      disabled={true}
                      icon={HeartPulse}
                    />
                  </div>
                  <SettingField
                    label="Email Address"
                    value={patient.email}
                    disabled={true}
                    icon={Mail}
                  />
                </div>

                {/* Editable Contact */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                    <span className="text-[10px] font-bold uppercase text-indigo-500 tracking-widest">
                      Contact Details
                    </span>
                    <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                  </div>
                  <SettingField
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    icon={Phone}
                  />
                  <SettingField
                    label="Home Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    icon={MapPin}
                  />

                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl space-y-4 border border-indigo-100 dark:border-indigo-500/20">
                    <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase flex items-center gap-2">
                      <HeartPulse className="w-3 h-3" /> Emergency Contact
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <SettingField
                        label="Name"
                        name="ecName"
                        value={formData.ecName}
                        onChange={handleInputChange}
                      />
                      <SettingField
                        label="Relation"
                        name="ecRelation"
                        value={formData.ecRelation}
                        onChange={handleInputChange}
                      />
                    </div>
                    <SettingField
                      label="Emergency Phone"
                      name="ecPhone"
                      value={formData.ecPhone}
                      onChange={handleInputChange}
                      icon={Phone}
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-lg shadow-indigo-500/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}