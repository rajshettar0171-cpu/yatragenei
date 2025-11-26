"use client";

import { useState } from "react";

export type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSend: (message: string) => Promise<void>;
  messages: ChatMessage[];
  loading: boolean;
};

export function ChatModal({ open, onClose, onSend, messages, loading }: Props) {
  const [draft, setDraft] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 md:items-center">
      <div className="glass-panel relative w-full max-w-2xl rounded-3xl p-6 shadow-card">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-600 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300"
        >
          Close
        </button>
        <h3 className="text-2xl font-semibold text-white">Ask the Shimla Ops Desk</h3>
        <p className="text-sm text-slate-400">
          Try “Is Kufri crowded today?” or “Alternate for Kufri if roads closed.”
        </p>

        <div className="mt-4 max-h-[360px] space-y-3 overflow-y-auto rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
          {messages.length === 0 && (
            <p className="text-sm text-slate-400">
              No chat history yet. Ask something that helps you travel smarter.
            </p>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`rounded-2xl px-4 py-3 text-sm ${
                message.role === "assistant"
                  ? "bg-emerald-500/10 text-emerald-100"
                  : "bg-slate-800/80 text-slate-100"
              }`}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                {message.role === "assistant" ? "Assistant" : "You"}
              </p>
              <p>{message.text}</p>
            </div>
          ))}
        </div>

        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            const payload = draft.trim();
            setDraft("");
            await onSend(payload);
          }}
          className="mt-4 flex gap-3"
        >
          <input
            type="text"
            placeholder="Ask about crowds, weather, or hidden gems..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="flex-1 rounded-2xl border border-slate-600 bg-slate-900/70 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-slate-900 disabled:opacity-40"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}

