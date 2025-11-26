"use client";

import { DayPlan } from "@/lib/types";
import { clsx } from "clsx";

type Props = {
  day: DayPlan;
};

const gradient = [
  "from-amber-500/10 to-amber-200/5",
  "from-cyan-500/10 to-cyan-200/5",
  "from-emerald-500/10 to-emerald-200/5",
  "from-fuchsia-500/10 to-fuchsia-200/5",
];

export function ItineraryCard({ day }: Props) {
  return (
    <section className="glass-panel rounded-3xl p-6 shadow-card">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Day {day.day}</p>
          <h3 className="text-2xl font-semibold text-white">{day.theme}</h3>
        </div>
        <span
          className={clsx(
            "rounded-full border border-slate-600 px-3 py-1 text-xs uppercase tracking-wide text-slate-200",
            gradient[(day.day - 1) % gradient.length]
          )}
        >
          Hidden Gem Focus
        </span>
      </header>

      <div className="space-y-4">
        {day.segments.map((segment) => (
          <div
            key={`${day.day}-${segment.timeOfDay}`}
            className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 md:flex md:items-start md:gap-6"
          >
            <div className="mb-3 shrink-0 text-sm font-semibold uppercase tracking-widest text-amber-300 md:mb-0">
              <p>{segment.timeOfDay}</p>
              <p className="text-slate-400">{segment.startTime}</p>
              <p className="text-slate-500">{segment.durationHours} hrs</p>
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-semibold text-white">{segment.title}</h4>
              <p className="text-sm text-slate-300">{segment.description}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                <Detail label="Entry Fee" value={segment.entryFee} />
                <Detail
                  label="Interest Score"
                  value={`${segment.interestMatchScore}/10`}
                />
                <Detail
                  label="Travel"
                  value={`${segment.travelDistanceKm.toFixed(1)} km · ${segment.travelSuggestion}`}
                />
                <Detail label="Food Stop" value={segment.foodStop} />
              </div>
              <p className="text-xs text-slate-400">{segment.notes}</p>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
          Why this plan
        </p>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          {Object.entries(day.whyPlan).map(([label, value]) => (
            <div key={label}>
              <p className="text-xs uppercase text-slate-500">{label}</p>
              <p className="text-sm text-white">{value}</p>
            </div>
          ))}
        </div>
      </footer>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800/60 bg-slate-950/60 px-3 py-2">
      <p className="text-[0.65rem] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

