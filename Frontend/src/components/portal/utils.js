// src/components/portal/utils.js

export const DEFAULT_AVATAR = "https://img.freepik.com/premium-photo/human-resources-manager-digital-avatar-generative-ai_934475-9192.jpg?ga=GA1.1.273726104.1763057097&semt=ais_hybrid&w=740&q=80";

export const glassBase = {
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.22)",
  borderRadius: 12,
  boxShadow: "0 12px 40px rgba(8,18,40,0.06)",
  color: "#061226",
};

export function calcAge(dob) {
  if (!dob) return "";
  const b = new Date(dob);
  const diff = Date.now() - b.getTime();
  const ageDt = new Date(diff);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
}

export const deriveStats = (p) => {
  const out = {};
  out.brain = [p?.currentHealth?.mentalHealthStatus || "No data available"];
  out.lungs = [p?.medicalHistory?.organHealth || "—"];
  out.heart = [`BP: ${p?.diagnostics?.vitalSigns?.bloodPressure || "—"}`, `HR: ${p?.diagnostics?.vitalSigns?.heartRate || "—"}`];
  out.digest = [p?.diagnostics?.organFunction?.others || "—"];
  out.liver = [p?.diagnostics?.organFunction?.liver || "—"];
  out.kidney = [p?.diagnostics?.organFunction?.kidney || "—"];
  const surg = (p?.medicalHistory?.surgicalProcedures || []).slice(-2).reverse();
  out.msk = surg.length ? surg : ["—"];
  out.mobility = [p?.currentHealth?.exerciseRoutine || "Not set"];
  return out;
};

export function computeStaticCardPlacement() {
  return {
    brain:    { left: '15%', top: '12%', lineStart: '45% 15%' },
    lungs:    { left: '07%', top: '33%', lineStart: '42% 35%' },
    liver:    { left: '09%', top: '50%', lineStart: '44% 45%' },
    msk:      { left: '11%', top: '74%', lineStart: '46% 70%' },
    heart:    { left: '62%', top: '13%', lineStart: '55% 25%' },
    digest:   { left: '68%', top: '33%', lineStart: '58% 45%' },
    kidney:   { left: '66%', top: '50%', lineStart: '58% 55%' },
    mobility: { left: '64%', top: '74%', lineStart: '55% 75%' },
  };
}