// src/pages/PatientPortal.jsx
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import usePatientStore from "../Store/PatientStore"; // Ensure this path is correct in your project

// Import from the new folder
import { DEFAULT_AVATAR, glassBase } from "../components/portal/utils";
import { LeftPanel, RightPanel } from "../components/portal/SidePanels";
import CenterViewport from "../components/portal/CenterViewport";

export default function PatientPortal() {
  const { patientData } = usePatientStore();

  toast.success("wooof u made it !!");

  const [patient, setPatient] = useState(patientData || {
    profilePic: DEFAULT_AVATAR,
    name: "Unknown Patient",
    uid: "—", email: "—", gender: "—", dob: null,
    diagnostics: { vitalSigns: { bloodPressure: "—", heartRate: "—", bmi: "—", sugarLevels: "—" }, organFunction: { liver: "—", kidney: "—", others: "—" } },
    currentHealth: { mentalHealthStatus: "No data available", exerciseRoutine: "Not set", medications: [] },
    medicalHistory: { organHealth: "—", surgicalProcedures: [], healthConditions: [], allergies: [], vaccinationRecords: [] },
    phone: "—", emergencyContact: null, address: "—",
    admin: { nextAppointment: null, insuranceDetails: "—" },
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate BMI for body percentage logic
  let bodyPercent = 80;
  if (patient?.diagnostics?.vitalSigns?.bmi) {
    const bmi = parseFloat(patient.diagnostics.vitalSigns.bmi);
    if (isFinite(bmi)) bodyPercent = Math.max(30, Math.min(98, Math.round(100 - Math.abs(22 - bmi) * 4)));
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setTimeout(() => { if (mounted) setLoading(false); }, 500);
    return () => (mounted = false);
  }, []);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ ...glassBase, padding: 18 }}>Loading patient dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%", background: "linear-gradient(180deg,#e8efff,#e6eefc)", padding: 18, boxSizing: "border-box" }}>
      
      {/* Header */}
      <div><h1 className="text-2xl font-bold mb-4">Welcome, {patient.name}</h1></div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>MediVault</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setActiveTab("overview")} style={{ padding: "8px 12px", borderRadius: 10, background: activeTab === "overview" ? "#eef2ff" : "transparent", border: "none" }}>Overview</button>
            <button onClick={() => setActiveTab("timeline")} style={{ padding: "8px 12px", borderRadius: 10, background: activeTab === "timeline" ? "#eef2ff" : "transparent", border: "none" }}>Timeline</button>
            <button onClick={() => setActiveTab("allergies")} style={{ padding: "8px 12px", borderRadius: 10, background: activeTab === "allergies" ? "#eef2ff" : "transparent", border: "none" }}>Allergies & Immunization</button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800 }}>{patient.name}</div>
            <div style={{ fontSize: 12, color: "#475569" }}>{patient.uid} • {patient?.gender || "—"}</div>
          </div>
          <img src={patient.profilePic || DEFAULT_AVATAR} alt="avatar" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }} />
        </div>
      </div>

      {/* Main Grid Layout */}
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr 360px", gap: 18, height: "calc(100vh - 86px)" }}>
        <LeftPanel patient={patient} bodyPercent={bodyPercent} />
        <CenterViewport patient={patient} activeTab={activeTab} />
        <RightPanel patient={patient} />
      </div>
    </div>
  );
}