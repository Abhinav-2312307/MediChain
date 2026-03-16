import { useState } from "react";

export default function PatientChat({ patient }) {
  const [msg, setMsg] = useState("");

  const chat = patient?.admin?.chatHistory || [];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col h-[500px]">
      <div className="flex-1 overflow-y-auto space-y-2">
        {chat.map((c, i) => (
          <div
            key={i}
            className="p-2 border border-slate-200 dark:border-slate-800 rounded text-slate-700 dark:text-slate-200"
          >
            <b>{c.sender}</b>: {c.message}
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4">
        <input
          className="border border-slate-200 dark:border-slate-800 p-2 flex-1 rounded bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
