"use client";

import { Alert } from "@/lib/types";

type Props = {
  alerts: Alert[];
};

const severityColor: Record<string, string> = {
  high: "border-red-500/80 bg-red-500/10 text-red-100",
  medium: "border-amber-500/80 bg-amber-500/10 text-amber-100",
  low: "border-emerald-500/80 bg-emerald-500/10 text-emerald-100",
};

export function AlertsPanel({ alerts }: Props) {
  if (!alerts?.length) return null;

  return (
    <section className="glass-panel rounded-3xl p-6 shadow-card">
      <header className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-white">Live alerts & intelligence</h3>
        <span className="text-xs uppercase tracking-[0.4em] text-slate-400">Real-time</span>
      </header>
      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4"
          >
            <span
              className={`inline-block rounded-full border px-3 py-1 text-xs uppercase tracking-[0.3em] ${severityColor[alert.severity]}`}
            >
              {alert.type.replace("_", " ")}
            </span>
            <h4 className="mt-2 text-lg font-semibold text-white">{alert.title}</h4>
            <p className="text-sm text-slate-300">{alert.description}</p>
            <p className="mt-1 text-xs text-slate-500">
              Areas: {alert.affectedAreas.join(", ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

