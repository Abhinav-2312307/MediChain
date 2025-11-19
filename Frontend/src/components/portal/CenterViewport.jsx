import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, ContactShadows } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import HumanModel from "./HumanModel";
import { GlassStatCard } from "./PortalUI";
import { deriveStats, computeStaticCardPlacement, GLASS_CLASSES } from "./utils";
import { useTheme } from "../../context/ThemeContext";

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
  const { isDark } = useTheme(); // for theme

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
      className="relative rounded-xl overflow-hidden h-full transition-colors duration-500"
      style={{
        backgroundImage: `url(/platform.png)`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat',
        zIndex: 1,
      }}
    >
      {/* darkens the background image in dark mode */}
      <div className="absolute inset-0 bg-indigo-50/0 dark:bg-slate-900/50 pointer-events-none z-0 transition-colors duration-500" />

      {activeTab === "overview" && (
        <>
          <Canvas style={{ width: "100%", height: "100%", zIndex: 10 }} camera={{ position: [0, 1.6, 4.0], fov: 40 }}>
            <ambientLight intensity={isDark ? 0.6 : 0.95} />
            <directionalLight intensity={isDark ? 0.8 : 1} position={[4, 5, 5]} />
            <Suspense fallback={null}>
              <HumanModel onModelClick={() => setOpenCloud((s) => !s)} />
              <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.4} maxPolarAngle={Math.PI - 0.5} />
              <ContactShadows position={[0, -0.95, 0]} opacity={0.45} scale={2.6} blur={2} far={1.2} />
            </Suspense>
          </Canvas>

          {!openCloud && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full z-20 text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-lg pointer-events-none">
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
              
              // White lines in dark mode, Dark Blue in light mode
              const strokeColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(8,18,40,0.6)";
              
              return <path key={id} d={`M ${sx} ${sy} L ${tx} ${ty}`} stroke={strokeColor} strokeWidth="2" fill="none" strokeLinecap="round" />;
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
      
      <div className="relative z-10 h-full">
         {activeTab === "timeline" && <TimelineView patient={patient} />}
         {activeTab === "allergies" && <AllergyView patient={patient} />}
      </div>
    </div>
  );
}

const TimelineView = ({ patient }) => (
  <div className="p-5 h-full overflow-auto">
    <div className="font-black text-xl mb-4 text-slate-900 dark:text-white">Medical Timeline</div>
    <div className={`${GLASS_CLASSES} p-4`}>
      <div className="font-extrabold text-slate-900 dark:text-white">Surgical Procedures</div>
      <ul className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">{(patient?.medicalHistory?.surgicalProcedures || []).length ? patient.medicalHistory.surgicalProcedures.map((s, i) => <li key={i}>• {s}</li>) : <li>None recorded</li>}</ul>
    </div>
    <div className="h-4" />
    <div className={`${GLASS_CLASSES} p-4`}>
      <div className="font-extrabold text-slate-900 dark:text-white">Past Hospitalizations</div>
      <div className="mt-3 space-y-3">{(patient?.medicalHistory?.pastHospitalizations || []).length ? patient.medicalHistory.pastHospitalizations.map((h, i) => <div key={i} className="border-b border-white/10 pb-2 last:border-0"><div className="font-bold text-slate-800 dark:text-slate-200">{h.reason}</div><div className="text-xs text-slate-500 dark:text-slate-400">{h.duration} • {h.hospitalName}</div></div>) : <div className="text-slate-500 dark:text-slate-400">No hospitalizations recorded</div>}</div>
    </div>
  </div>
);

const AllergyView = ({ patient }) => (
  <div className="p-5 h-full overflow-auto">
     <div className="font-black text-xl mb-4 text-slate-900 dark:text-white">Allergies & Immunization</div>
     <div className={`${GLASS_CLASSES} p-4`}>
        <div className="font-extrabold text-slate-900 dark:text-white">Allergies</div>
        <ul className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">{(patient?.medicalHistory?.allergies || []).length ? patient.medicalHistory.allergies.map((a, i) => <li key={i}>• {a}</li>) : <li>No allergies recorded</li>}</ul>
     </div>
     <div className="h-4" />
     <div className={`${GLASS_CLASSES} p-4`}>
       <div className="font-extrabold text-slate-900 dark:text-white">Vaccination Records</div>
       <ul className="mt-2 space-y-1 text-slate-700 dark:text-slate-300">{(patient?.medicalHistory?.vaccinationRecords || []).length ? patient.medicalHistory.vaccinationRecords.map((v, i) => <li key={i}>• {v}</li>) : <li>No vaccination records</li>}</ul>
     </div>
  </div>
);