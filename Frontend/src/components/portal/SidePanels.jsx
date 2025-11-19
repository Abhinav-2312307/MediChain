// src/components/portal/SidePanels.jsx
import React from "react";
import { glassBase, calcAge } from "./utils";
import { Donut } from "./PortalUI";

export function LeftPanel({ patient, bodyPercent }) {
  const age = patient?.dob ? calcAge(patient.dob) : "";
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ padding: 12, ...glassBase }}>
        <div style={{ display: "flex", gap: 12 }}>
          <img src={patient.profilePic} alt="pf" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }} />
          <div>
            <div style={{ fontWeight: 800 }}>{patient.name}</div>
            <div style={{ fontSize: 13, color: "#475569" }}>{patient.email}</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>{patient?.gender || "—"} {age ? `• ${age} yrs` : ""}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(79,70,229,0.08)", fontWeight: 700 }}>{patient?.diagnostics?.vitalSigns?.bloodPressure || "BP —"}</div>
          <div style={{ padding: "8px 10px", borderRadius: 10, background: "rgba(79,70,229,0.08)", fontWeight: 700 }}>{patient?.diagnostics?.vitalSigns?.heartRate || "HR —"}</div>
        </div>
      </div>

      <div style={{ padding: 12, ...glassBase }}>
        <div style={{ fontWeight: 800 }}>Quick Health</div>
        <div style={{ marginTop: 8, fontSize: 13 }}>
          <div>Body Condition: <strong>{bodyPercent}%</strong></div>
          <div style={{ marginTop: 6 }}>Exercise: {patient?.currentHealth?.exerciseRoutine || "Not set"}</div>
          <div style={{ marginTop: 6 }}>Medications: {(patient?.currentHealth?.medications || []).length ? patient.currentHealth.medications.map(m => m.name).join(", ") : "None listed"}</div>
        </div>
      </div>

      <div style={{ padding: 12, ...glassBase }}>
        <div style={{ fontWeight: 800 }}>Contact</div>
        <div style={{ marginTop: 8 }}>
          <div>Phone: {patient?.phone || "—"}</div>
          <div style={{ marginTop: 6 }}>Emergency: {patient?.emergencyContact?.name ? `${patient.emergencyContact.name} (${patient.emergencyContact.relation})` : "—"}</div>
          <div style={{ marginTop: 6 }}>Address: {patient?.address || "—"}</div>
        </div>
      </div>

      <div style={{ padding: 12, ...glassBase, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Donut percent={bodyPercent} />
      </div>
    </div>
  );
}

export function RightPanel({ patient }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ padding: 12, ...glassBase }}>
        <div style={{ fontWeight: 800 }}>Vitals</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
          <VitalBox label="Blood Pressure" value={patient?.diagnostics?.vitalSigns?.bloodPressure} />
          <VitalBox label="Heart Rate" value={patient?.diagnostics?.vitalSigns?.heartRate} />
          <VitalBox label="BMI" value={patient?.diagnostics?.vitalSigns?.bmi} />
          <VitalBox label="Sugar" value={patient?.diagnostics?.vitalSigns?.sugarLevels} />
        </div>
      </div>
      
      <div style={{ padding: 12, ...glassBase }}>
        <div style={{ fontWeight: 800 }}>Medical History Summary</div>
        <div style={{ marginTop: 8 }}>
          <div>Conditions: {(patient?.medicalHistory?.healthConditions || []).join(", ") || "—"}</div>
          <div style={{ marginTop: 6 }}>Organ Health: {patient?.medicalHistory?.organHealth || "—"}</div>
        </div>
      </div>

      <div style={{ padding: 12, ...glassBase }}>
        <div style={{ fontWeight: 800 }}>Admin</div>
        <div style={{ marginTop: 8 }}>
          <div>Next Appointment: {patient?.admin?.nextAppointment ? new Date(patient.admin.nextAppointment).toLocaleString() : "Not set"}</div>
          <div style={{ marginTop: 6 }}>Insurance: {patient?.admin?.insuranceDetails || "—"}</div>
        </div>
      </div>
    </div>
  );
}

const VitalBox = ({ label, value }) => (
  <div style={{ ...glassBase, padding: 10 }}>
    <div style={{ fontSize: 12, color: "#475569" }}>{label}</div>
    <div style={{ fontWeight: 800, fontSize: 16 }}>{value || "—"}</div>
  </div>
);