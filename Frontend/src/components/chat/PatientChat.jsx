import { useState } from "react";

import MessageBubble from "./MessageBubble";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Section from "../ui/Section";
import { formatDateTime, normalizeList } from "../../lib/patient";

function isProviderMessage(chatItem) {
  const sender = (chatItem?.sender || "").toLowerCase();

  return (
    sender.includes("doctor") ||
    sender.includes("dr.") ||
    sender.includes("dr ") ||
    sender.includes("provider") ||
    sender.includes("nurse") ||
    sender.includes("hospital")
  );
}

export default function PatientChat({ patient }) {
  const [message, setMessage] = useState("");
  const chatHistory = normalizeList(patient?.admin?.chatHistory);
  const lastMessage = chatHistory.at(-1);

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <Section
        title="Care team chat"
        description="Recent secure conversation history with your providers."
        className="min-h-[680px]"
      >
        <div className="flex h-[560px] flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            {chatHistory.length ? (
              chatHistory.map((chatItem, index) => (
                <MessageBubble
                  key={`${chatItem?.sender || "chat"}-${index}`}
                  message={chatItem}
                  isProvider={isProviderMessage(chatItem)}
                />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500 transition-colors dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400">
                No chat history is available yet.
              </div>
            )}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
            <div className="flex gap-3">
              <Input
                value={message}
                disabled
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Secure messaging composer coming soon"
              />
              <Button disabled={!message.trim()}>Send</Button>
            </div>
          </div>
        </div>
      </Section>

      <div className="space-y-6">
        <Section
          title="Conversation details"
          description="Quick context for the latest activity."
        >
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Last message
              </p>
              <p className="mt-3 font-medium text-slate-900 dark:text-slate-100">
                {formatDateTime(lastMessage?.timestamp, "No recent message")}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors dark:border-slate-800 dark:bg-slate-950/60">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Total messages
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {chatHistory.length}
              </p>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}
