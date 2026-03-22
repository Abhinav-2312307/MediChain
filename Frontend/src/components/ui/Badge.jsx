import clsx from "clsx";

export default function Badge({ className = "", children }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300",
        className
      )}
    >
      {children}
    </span>
  );
}
