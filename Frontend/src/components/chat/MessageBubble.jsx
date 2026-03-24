import { formatDateTime, getInitials } from "../../lib/patient";

export default function MessageBubble({ message, isProvider }) {
  const sender = message?.sender || (isProvider ? "Care Team" : "You");
  const bubbleClasses = isProvider
    ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100"
    : "bg-blue-500 text-white";
  const wrapperClasses = isProvider ? "items-start" : "items-end";

  return (
    <div className={`flex flex-col gap-2 ${wrapperClasses}`}>
      <div className={`flex max-w-[85%] items-end gap-3 ${isProvider ? "" : "flex-row-reverse"}`}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100">
          {getInitials(sender)}
        </div>

        <div className={`rounded-2xl px-4 py-3 shadow-sm ${bubbleClasses}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-70">
            {sender}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6">
            {message?.message || "No message content."}
          </p>
          <p className="mt-3 text-[11px] opacity-70">
            {formatDateTime(message?.timestamp, "Timestamp unavailable")}
          </p>
        </div>
      </div>
    </div>
  );
}
