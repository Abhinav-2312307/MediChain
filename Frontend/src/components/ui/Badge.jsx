import clsx from "clsx";

export default function Badge({ className = "", children }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-200",
        className
      )}
    >
      {children}
    </span>
  );
}
