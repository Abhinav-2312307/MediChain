import clsx from "clsx";

export default function Card({ className = "", children }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60",
        className
      )}
    >
      {children}
    </div>
  );
}
