import { useState } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Input from "../ui/Input";

export default function PatientChat({ patient }) {
  const [message, setMessage] = useState("");
  const chatHistory = patient?.admin?.chatHistory || [];

  return (
    <Card className="flex h-[500px] flex-col">
      <div className="flex-1 space-y-2 overflow-y-auto">
        {chatHistory.map((chatItem, index) => (
          <div
            key={`${chatItem.sender || "chat"}-${index}`}
            className="rounded border border-slate-200 p-2 text-slate-700 dark:border-slate-800 dark:text-slate-200"
          >
            <b>{chatItem.sender}</b>: {chatItem.message}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <Input value={message} onChange={(event) => setMessage(event.target.value)} />
        <Button disabled={!message.trim()}>Send</Button>
      </div>
    </Card>
  );
}
