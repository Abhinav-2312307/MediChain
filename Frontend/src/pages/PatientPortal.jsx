import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

import { useTheme } from "../context/ThemeContext";
import usePatientStore from "../Store/PatientStore";
import { DEFAULT_AVATAR, GLASS_CLASSES } from "../components/portal/utils";

// Sub-components
import PortalNavbar from "../components/portal/PortalNavbar";
import SettingsModal from "../components/portal/SettingsModal";
import { LeftPanel, RightPanel } from "../components/portal/SidePanels";
import CenterViewport from "../components/portal/CenterViewport";

const API_URL = "http://localhost:5001";

export default function PatientPortal() {
  const { patientData } = usePatientStore();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Patient Data State
  const [patient, setPatient] = useState(() => {
    try {
      const saved = localStorage.getItem("patient_profile_data");
      return saved ? JSON.parse(saved) : patientData || getDefaultPatient();
    } catch (e) {
      return patientData || getDefaultPatient();
    }
  });

  // --- HELPERS ---
  function getDefaultPatient() {
    return {
      profilePic: DEFAULT_AVATAR,
      name: "Unknown Patient",
      uid: "—",
      email: "—",
      gender: "—",
      dob: null,
      diagnostics: {
        vitalSigns: { bloodPressure: "—", heartRate: "—", bmi: "—", sugarLevels: "—" },
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

  // --- EFFECTS ---
  useEffect(() => {
    toast.success("Welcome to the Portal!");
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    setTimeout(() => {
      if (mounted) {
        setLoading(false);
        // Delay enabling 3D view until layout stabilizes
        setTimeout(() => {
          if (mounted) setIsLayoutReady(true);
        }, 150);
      }
    }, 500);

    return () => (mounted = false);
  }, []);

  // --- ACTIONS ---
  const handleSaveProfile = (formData) => {
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

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/logout`);
      toast.success(res?.data?.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
      navigate("/login");
    }
  };

  // Calculate BMI percentage for visual indicators
  let bodyPercent = 80;
  if (patient?.diagnostics?.vitalSigns?.bmi) {
    const bmi = parseFloat(patient.diagnostics.vitalSigns.bmi);
    if (isFinite(bmi))
      bodyPercent = Math.max(30, Math.min(98, Math.round(100 - Math.abs(22 - bmi) * 4)));
  }

  // --- RENDER ---
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950 transition-colors duration-300">
        <div className={`${GLASS_CLASSES} p-6`}>Loading patient dashboard...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#e8efff] to-[#e6eefc] dark:from-slate-950 dark:to-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden">
      
      <PortalNavbar
        patient={patient}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Grid */}
      <div className="flex-1 p-4 min-h-0 relative z-0">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr 360px",
            gap: 18,
            height: "calc(100vh - 100px)",
          }}
        >
          {/* Left Panel */}
          <div className="overflow-y-auto pr-1 custom-scrollbar">
            <LeftPanel patient={patient} bodyPercent={bodyPercent} />
          </div>

          {/* Center 3D Viewport */}
          <div className="h-full min-h-0 relative rounded-2xl overflow-hidden">
            {isLayoutReady && (
              <CenterViewport patient={patient} activeTab={activeTab} />
            )}
          </div>

          {/* Right Panel */}
          <div className="overflow-y-auto pl-1 custom-scrollbar">
            <RightPanel patient={patient} />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        patient={patient}
        onSave={handleSaveProfile}
      />
    </div>
  );
}