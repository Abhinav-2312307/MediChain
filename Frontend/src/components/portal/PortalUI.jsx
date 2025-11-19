// src/components/portal/PortalUI.jsx
import React from "react";
import { motion } from "framer-motion";
import { glassBase } from "./utils";

export function GlassStatCard({ title, lines = [], styleProps = {}, id }) {
  const { left, top, transform = "translate(-50%,-50%)" } = styleProps;
  return (
    <motion.div
      key={id || title}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "absolute", left, top, transform,
        padding: "12px 14px", minWidth: 170,
        ...glassBase, color: "#041225", fontWeight: 700,
        zIndex: 30, pointerEvents: "auto",
      }}
    >
      <div style={{ fontSize: 12, opacity: 0.85 }}>{title}</div>
      <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13, color: "#08203a", lineHeight: 1.3 }}>
        {lines.length ? lines.map((l, i) => <div key={i}>{l}</div>) : <div style={{ color: "#475569" }}>—</div>}
      </div>
    </motion.div>
  );
}

export function Donut({ percent = 80, size = 140 }) {
  const r = (size - 20) / 2;
  const c = 2 * Math.PI * r;
  const healthy = Math.max(0, Math.min(100, Math.round(percent)));
  const dash = (healthy / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          <circle r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="18" />
          <circle r={r} fill="none" stroke="rgba(79,70,229,0.92)" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} transform="rotate(-90)" />
        </g>
      </svg>
      <div style={{ fontWeight: 800 }}>{healthy}%</div>
      <div style={{ fontSize: 12, color: "#475569" }}>Body Condition</div>
    </div>
  );
}