import clsx from "clsx";

export default function Card({ className = "", children }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-slate-950/30",
        className
      )}
    >
      {children}
    </div>
  );
}
