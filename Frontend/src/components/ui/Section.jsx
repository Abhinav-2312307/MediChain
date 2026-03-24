import Card from "./Card";
import { cn } from "../../lib/utils";

export default function Section({
  title,
  description,
  action,
  className = "",
  contentClassName = "",
  children,
}) {
  return (
    <Card className={className}>
      {title || description || action ? (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </Card>
  );
}
