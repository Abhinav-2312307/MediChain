import clsx from "clsx";

export default function Loader({ label = "Loading...", className = "" }) {
  return (
    <div className={clsx("flex items-center gap-3 text-slate-500 dark:text-slate-400", className)}>
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600 dark:border-slate-700 dark:border-t-emerald-300" />
      <span>{label}</span>
    </div>
  );
}
