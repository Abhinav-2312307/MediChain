// src/components/portal/CenterViewport.jsx
import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import HumanModel from "./HumanModel";
import { GlassStatCard } from "./PortalUI";
import { deriveStats, computeStaticCardPlacement, glassBase } from "./utils";

const statOrder = ["brain", "lungs", "heart", "digest", "liver", "kidney", "msk", "mobility"];
const cardPlacements = computeStaticCardPlacement();

const titleMap = {
  brain: "Brain", lungs: "Lungs / Respiratory", heart: "Heart / Chest",
  digest: "Digestive / Others", liver: "Liver Function", kidney: "Kidney Function",
  msk: "Musculoskeletal", mobility: "Mobility / Lower Body",
};

export default function CenterViewport({ patient, activeTab }) {
  const [openCloud, setOpenCloud] = useState(false);
  const containerRef = useRef(null);
  const [rect, setRect] = useState({ width: 1, height: 1 });
  const stats = deriveStats(patient);

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setRect({ width: r.width, height: r.height });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      if (ro && containerRef.current) ro.unobserve(containerRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", borderRadius: 14, overflow: "hidden",
        backgroundImage: `url(/platform.png)`, backgroundSize: 'cover',
        backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        zIndex: 1, height: "100%",
      }}
    >
      {activeTab === "overview" && (
        <>
          <Canvas style={{ width: "100%", height: "100%" }} camera={{ position: [0, 1.6, 4.0], fov: 40 }}>
            <ambientLight intensity={0.95} />
            <directionalLight intensity={1} position={[4, 5, 5]} />
            <Suspense fallback={null}>
              <HumanModel onModelClick={() => setOpenCloud((s) => !s)} />
              <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.4} maxPolarAngle={Math.PI - 0.5} />
              <ContactShadows position={[0, -0.95, 0]} opacity={0.45} scale={2.6} blur={2} far={1.2} />
            </Suspense>
          </Canvas>

          {!openCloud && (
            <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", padding: "8px 12px", background: "rgba(255,255,255,0.9)", borderRadius: 12, zIndex: 20 }}>
              Click the model to show organ stats
            </div>
          )}

          <svg width={rect.width} height={rect.height} viewBox={`0 0 ${rect.width} ${rect.height}`} style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none", zIndex: 25 }}>
            {openCloud && statOrder.map((id) => {
              const placement = cardPlacements[id];
              if (!placement) return null;
              const [sxPercent, syPercent] = placement.lineStart.split(' ').map(p => parseFloat(p) / 100);
              const sx = rect.width * sxPercent;
              const sy = rect.height * syPercent;
              const tx = rect.width * (parseFloat(placement.left) / 100);
              const ty = rect.height * (parseFloat(placement.top) / 100);
              return <path key={id} d={`M ${sx} ${sy} L ${tx} ${ty}`} stroke="rgba(8,18,40,0.6)" strokeWidth="3" fill="none" strokeLinecap="round" />;
            })}
          </svg>

          <AnimatePresence>
            {openCloud && statOrder.map((id) => {
              const placement = cardPlacements[id];
              if (!placement) return null;
              return <GlassStatCard key={id} id={id} title={titleMap[id]} lines={stats[id] || []} styleProps={{ ...placement, transform: "translate(-50%,-50%)" }} />;
            })}
          </AnimatePresence>
        </>
      )}
      
      {activeTab === "timeline" && <TimelineView patient={patient} />}
      {activeTab === "allergies" && <AllergyView patient={patient} />}
    </div>
  );
}

const TimelineView = ({ patient }) => (
  <div style={{ padding: 20, height: "100%", overflow: "auto" }}>
    <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12 }}>Medical Timeline</div>
    <div style={{ ...glassBase, padding: 14 }}>
      <div style={{ fontWeight: 800 }}>Surgical Procedures</div>
      <ul style={{ marginTop: 8 }}>{(patient?.medicalHistory?.surgicalProcedures || []).length ? patient.medicalHistory.surgicalProcedures.map((s, i) => <li key={i}>{s}</li>) : <li>None recorded</li>}</ul>
    </div>
    <div style={{ height: 12 }} />
    <div style={{ ...glassBase, padding: 14 }}>
      <div style={{ fontWeight: 800 }}>Past Hospitalizations</div>
      <div style={{ marginTop: 8 }}>{(patient?.medicalHistory?.pastHospitalizations || []).length ? patient.medicalHistory.pastHospitalizations.map((h, i) => <div key={i} style={{ marginBottom: 8 }}><div style={{ fontWeight: 700 }}>{h.reason}</div><div style={{ fontSize: 12, color: "#475569" }}>{h.duration} • {h.hospitalName}</div></div>) : <div>No hospitalizations recorded</div>}</div>
    </div>
  </div>
);

const AllergyView = ({ patient }) => (
  <div style={{ padding: 20, height: "100%", overflow: "auto" }}>
     <div style={{ fontWeight: 900, fontSize: 20, marginBottom: 12 }}>Allergies & Immunization</div>
     <div style={{ ...glassBase, padding: 14 }}>
        <div style={{ fontWeight: 800 }}>Allergies</div>
        <ul style={{ marginTop: 8 }}>{(patient?.medicalHistory?.allergies || []).length ? patient.medicalHistory.allergies.map((a, i) => <li key={i}>{a}</li>) : <li>No allergies recorded</li>}</ul>
     </div>
     <div style={{ height: 12 }} />
     <div style={{ ...glassBase, padding: 14 }}>
       <div style={{ fontWeight: 800 }}>Vaccination Records</div>
       <ul style={{ marginTop: 8 }}>{(patient?.medicalHistory?.vaccinationRecords || []).length ? patient.medicalHistory.vaccinationRecords.map((v, i) => <li key={i}>{v}</li>) : <li>No vaccination records</li>}</ul>
     </div>
  </div>
);