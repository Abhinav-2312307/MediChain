import React from "react";
import { motion } from "framer-motion";
import { GLASS_CLASSES } from "./utils";

export function GlassStatCard({ title, lines = [], styleProps = {}, id }) {
  const { left, top, transform = "translate(-50%,-50%)" } = styleProps;
  return (
    <motion.div
      key={id || title}
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={GLASS_CLASSES}
      style={{
        position: "absolute", left, top, transform,
        padding: "12px 14px", minWidth: 170,
        zIndex: 30, pointerEvents: "auto",
      }}
    >
      <div className="text-xs opacity-85 font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{title}</div>
      <div className="mt-2 font-semibold text-[13px] leading-snug text-slate-900 dark:text-slate-200">
        {lines.length ? lines.map((l, i) => <div key={i}>{l}</div>) : <div className="text-slate-500 dark:text-slate-500">—</div>}
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
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`translate(${size / 2}, ${size / 2})`}>
          {/* Background circle - adapted for dark mode */}
          <circle r={r} fill="none" className="stroke-white/20 dark:stroke-slate-700/50" strokeWidth="18" />
          {/* Progress circle */}
          <circle r={r} fill="none" stroke="currentColor" className="text-indigo-600 dark:text-indigo-400" strokeWidth="18" strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} transform="rotate(-90)" />
        </g>
      </svg>
      <div className="font-black text-xl text-slate-900 dark:text-white">{healthy}%</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Body Condition</div>
    </div>
  );
}