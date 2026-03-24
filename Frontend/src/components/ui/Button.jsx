import clsx from "clsx";

export default function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) {
  const variants = {
    primary:
      "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300 dark:bg-greenish dark:text-slate-950 dark:hover:bg-emerald-300 dark:disabled:bg-emerald-200/60",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-800",
    ghost:
      "bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/80",
    danger:
      "bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300 dark:bg-rose-500 dark:hover:bg-rose-400 dark:disabled:bg-rose-300/70",
  };

  return (
    <button
      type={type}
      className={clsx(
        "inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
