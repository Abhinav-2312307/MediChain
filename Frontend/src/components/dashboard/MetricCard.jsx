import Card from "../ui/Card";

export default function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  accent = "bg-blue-50 text-blue-600",
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">{value}</p>
          {helper ? <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{helper}</p> : null}
        </div>

        {Icon ? (
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${accent}`}>
            <Icon size={20} />
          </div>
        ) : null}
      </div>
    </Card>
  );
}
