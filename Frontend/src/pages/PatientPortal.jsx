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

const API_URL = import.meta.env.VITE_Backend_API_URL || "http://localhost:5001";

export default function PatientPortal() {
  const patient = usePatientStore((state) => state.patientData);
  const updatePatientData = usePatientStore((state) => state.updatePatientData);
  const clearPatientData = usePatientStore((state) => state.clearPatientData);

  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if patient data not found
  useEffect(() => {
    if (!patient) navigate("/login");
  }, [patient]);

  // Load animation
  useEffect(() => {
    toast.success("Welcome to the Portal!");
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    setTimeout(() => {
      if (mounted) {
        setLoading(false);
        setTimeout(() => mounted && setIsLayoutReady(true), 150);
      }
    }, 500);

    return () => (mounted = false);
  }, []);

  // --- ACTIONS ---
  const handleSaveProfile = async (formDataInput) => {
    const formData = new FormData();

    if (formDataInput.bloodGroup) formData.append("bloodGroup", formDataInput.bloodGroup);
    if (formDataInput.address) formData.append("address", formDataInput.address);
    if (formDataInput.phone) formData.append("phone", formDataInput.phone);

    if (formDataInput.ecName) formData.append("emergencyContactName", formDataInput.ecName);
    if (formDataInput.ecRelation) formData.append("emergencyContactRelation", formDataInput.ecRelation);
    if (formDataInput.ecPhone) formData.append("emergencyContactPhone", formDataInput.ecPhone);

    if (formDataInput.profilePicFile) {
      formData.append("profilePic", formDataInput.profilePicFile);
    }

    try {
      const response = await axios.put(`${API_URL}/patient/update`, formData, {
        withCredentials: true,
      });

      const updatedPatientData = response.data.patient;
      updatePatientData(updatedPatientData);

      toast.success("Profile updated successfully!");
      setIsSettingsOpen(false);
    } catch (error) {
      console.error("API Update Error:", error);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      toast.error(error.response?.data?.message || "Error updating profile.");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/logout`, { withCredentials: true });
      clearPatientData(); // clears Zustand persisted data
      toast.success(res?.data?.message || "Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error logging out");
      navigate("/login");
    }
  };

  // Calculate BMI percentage for UI
  let bodyPercent = 80;
  if (patient?.diagnostics?.vitalSigns?.bmi) {
    const bmi = parseFloat(patient.diagnostics.vitalSigns.bmi);
    if (isFinite(bmi))
      bodyPercent = Math.max(30, Math.min(98, Math.round(100 - Math.abs(22 - bmi) * 4)));
  }

  // --- RENDER ---
  if (loading || !patient) {
    return (
      <div className="h-screen flex items-center justify-center bg-indigo-50 dark:bg-slate-950">
        <div className={`${GLASS_CLASSES} p-6`}>
          Loading patient dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-b from-[#e8efff] to-[#e6eefc] dark:from-slate-950 dark:to-slate-900">
      <PortalNavbar
        patient={patient}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={handleLogout}
      />

      <div className="flex-1 p-4 min-h-0 relative z-0">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr 360px",
            gap: 18,
            height: "calc(100vh - 100px)",
          }}
        >
          <div className="overflow-y-auto pr-1 custom-scrollbar">
            <LeftPanel patient={patient} bodyPercent={bodyPercent} />
          </div>

          <div className="h-full min-h-0 relative rounded-2xl overflow-hidden">
            {isLayoutReady && <CenterViewport patient={patient} activeTab={activeTab} />}
          </div>

          <div className="overflow-y-auto pl-1 custom-scrollbar">
            <RightPanel patient={patient} />
          </div>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        patient={patient}
        onSave={handleSaveProfile}
      />
    </div>
  );
}