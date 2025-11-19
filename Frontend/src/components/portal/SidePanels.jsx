import React from "react";
import { GLASS_CLASSES, calcAge } from "./utils";
import { Donut } from "./PortalUI";

// Helper to ensure content fits without scrolling
const COMPACT_GLASS = `${GLASS_CLASSES} p-3`;

export function LeftPanel({ patient, bodyPercent }) {
  const age = patient?.dob ? calcAge(patient.dob) : "";
  
  return (
    <div className="flex flex-col gap-3 pb-2">
      {/* Profile Card */}
      <div className={COMPACT_GLASS}>
        <div className="flex gap-3 items-center">
          <img src={patient.profilePic} alt="pf" className="w-14 h-14 rounded-lg object-cover border border-white/30 bg-slate-200" />
          <div className="min-w-0">
            <div className="font-bold text-base text-slate-900 dark:text-white truncate">{patient.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">{patient.email}</div>
            <div className="mt-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-1.5 py-0.5 rounded w-fit">
              {patient?.gender || "—"} • {age ? `${age} YRS` : ""}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="text-center py-1.5 rounded-md bg-indigo-50/50 dark:bg-white/5 border border-indigo-100 dark:border-white/5">
            <div className="text-[10px] uppercase text-slate-400 font-bold">BP</div>
            <div className="text-sm font-black text-slate-700 dark:text-slate-200">{patient?.diagnostics?.vitalSigns?.bloodPressure || "—"}</div>
          </div>
          <div className="text-center py-1.5 rounded-md bg-indigo-50/50 dark:bg-white/5 border border-indigo-100 dark:border-white/5">
            <div className="text-[10px] uppercase text-slate-400 font-bold">HR</div>
            <div className="text-sm font-black text-slate-700 dark:text-slate-200">{patient?.diagnostics?.vitalSigns?.heartRate || "—"}</div>
          </div>
        </div>
      </div>

      {/* Quick Health */}
      <div className={COMPACT_GLASS}>
        <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Quick Health</div>
        <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <div className="flex justify-between">
            <span>Body Condition:</span>
            <strong className="text-slate-900 dark:text-white">{bodyPercent}%</strong>
          </div>
          <div className="flex justify-between">
            <span>Exercise:</span>
            <span className="text-right truncate max-w-[120px]">{patient?.currentHealth?.exerciseRoutine || "Not set"}</span>
          </div>
          <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
            <span className="block mb-1 opacity-70">Medications:</span>
            <div className="truncate italic opacity-90">
              {(patient?.currentHealth?.medications || []).length ? patient.currentHealth.medications.map(m => m.name).join(", ") : "None listed"}
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className={COMPACT_GLASS}>
        <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Contact Info</div>
        <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
          <div className="truncate">📞 {patient?.phone || "—"}</div>
          <div className="truncate">🚑 {patient?.emergencyContact?.name ? `${patient.emergencyContact.name} (${patient.emergencyContact.relation})` : "—"}</div>
          <div className="truncate">🏠 {patient?.address || "—"}</div>
        </div>
      </div>

      {/* Donut Chart */}
      <div className={`${COMPACT_GLASS} flex items-center justify-center py-2`}>
        <Donut percent={bodyPercent} size={100} />
      </div>
    </div>
  );
}

export function RightPanel({ patient }) {
  return (
    <div className="flex flex-col gap-3 pb-2">
      {/* Vitals Grid */}
      <div className={COMPACT_GLASS}>
        <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Key Vitals</div>
        <div className="grid grid-cols-2 gap-2">
          <VitalBox label="Blood Pressure" value={patient?.diagnostics?.vitalSigns?.bloodPressure} />
          <VitalBox label="Heart Rate" value={patient?.diagnostics?.vitalSigns?.heartRate} />
          <VitalBox label="BMI" value={patient?.diagnostics?.vitalSigns?.bmi} />
          <VitalBox label="Sugar" value={patient?.diagnostics?.vitalSigns?.sugarLevels} />
        </div>
      </div>
      
      {/* History */}
      <div className={COMPACT_GLASS}>
        <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">History Summary</div>
        <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <div>
            <span className="opacity-70">Conditions:</span>
            <div className="font-semibold mt-0.5 leading-snug">{(patient?.medicalHistory?.healthConditions || []).join(", ") || "—"}</div>
          </div>
          <div>
            <span className="opacity-70">Organ Health:</span>
            <div className="font-semibold mt-0.5 leading-snug">{patient?.medicalHistory?.organHealth || "—"}</div>
          </div>
        </div>
      </div>

      {/* Admin */}
      <div className={COMPACT_GLASS}>
        <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Admin</div>
        <div className="text-xs space-y-2 text-slate-700 dark:text-slate-300">
          <div className="bg-indigo-50 dark:bg-white/5 p-2 rounded">
            <span className="block opacity-70 text-[10px] uppercase">Next Appointment</span>
            <div className="font-bold text-indigo-600 dark:text-indigo-300">
              {patient?.admin?.nextAppointment ? new Date(patient.admin.nextAppointment).toLocaleString() : "Not set"}
            </div>
          </div>
          <div className="bg-emerald-50 dark:bg-white/5 p-2 rounded">
            <span className="block opacity-70 text-[10px] uppercase">Insurance</span>
            <div className="font-bold text-emerald-600 dark:text-emerald-300 truncate">
              {patient?.admin?.insuranceDetails || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const VitalBox = ({ label, value }) => (
  <div className="p-2 rounded bg-white/40 dark:bg-white/5 border border-white/20">
    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none mb-1">{label}</div>
    <div className="font-black text-sm text-slate-900 dark:text-white truncate">{value || "—"}</div>
  </div>
);