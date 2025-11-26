"use client";

import { useState } from "react";
import { DestinationMeta } from "@/lib/types";

const INTEREST_OPTIONS = [
  "trekking",
  "food",
  "photography",
  "relaxation",
  "culture",
  "adventure",
  "nature",
  "shopping",
];

type FormState = {
  days: number;
  budget: "low" | "medium" | "high";
  traveler_type: "solo" | "couple" | "family";
  interests: string[];
  month: string;
};

export type TripFormProps = {
  loading: boolean;
  destinations: DestinationMeta[];
  selectedDestination: string;
  onDestinationChange: (id: string) => void;
  onSubmit: (data: FormState) => void;
};

const initialState: FormState = {
  days: 2,
  budget: "low",
  traveler_type: "solo",
  interests: ["trekking", "photography"],
  month: "November",
};

export function TripForm({
  loading,
  destinations,
  selectedDestination,
  onDestinationChange,
  onSubmit,
}: TripFormProps) {
  const [form, setForm] = useState<FormState>(initialState);

  const updateInterest = (interest: string) => {
    setForm((state) => {
      const exists = state.interests.includes(interest);
      let updated = exists
        ? state.interests.filter((item) => item !== interest)
        : [...state.interests, interest];
      if (updated.length === 0) {
        updated = state.interests;
      }
      return { ...state, interests: updated };
    });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="glass-panel rounded-3xl p-6 shadow-card"
    >
      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
        Rapid brief
      </p>
      <h2 className="text-3xl font-semibold text-white">
        Define your {destinations.find((d) => d.id === selectedDestination)?.name ?? "trip"} brief
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col text-sm text-slate-300">
          Destination
          <select
            value={selectedDestination}
            onChange={(event) => onDestinationChange(event.target.value)}
            className="mt-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
          >
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name} · {dest.region}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-300">
          Trip days
          <input
            type="number"
            min={1}
            max={7}
            value={form.days}
            onChange={(event) => setForm({ ...form, days: Number(event.target.value) })}
            className="mt-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-300">
          Travel month
          <input
            type="text"
            value={form.month}
            onChange={(event) => setForm({ ...form, month: event.target.value })}
            className="mt-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col text-sm text-slate-300">
          Budget
          <select
            value={form.budget}
            onChange={(event) =>
              setForm({ ...form, budget: event.target.value as FormState["budget"] })
            }
            className="mt-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="flex flex-col text-sm text-slate-300">
          Traveler type
          <select
            value={form.traveler_type}
            onChange={(event) =>
              setForm({
                ...form,
                traveler_type: event.target.value as FormState["traveler_type"],
              })
            }
            className="mt-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
          >
            <option value="solo">Solo</option>
            <option value="couple">Couple</option>
            <option value="family">Family</option>
          </select>
        </label>
      </div>

      <div className="mt-6">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">
          Interests (power the AI)
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {INTEREST_OPTIONS.map((interest) => {
            const active = form.interests.includes(interest);
            return (
              <button
                key={interest}
                type="button"
                onClick={() => updateInterest(interest)}
                className={`rounded-full border px-4 py-2 text-xs uppercase tracking-wide transition ${
                  active
                    ? "border-amber-400 bg-amber-300/10 text-amber-200"
                    : "border-slate-600 text-slate-300 hover:border-amber-500 hover:text-white"
                }`}
              >
                {interest}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex items-center justify-center rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 px-6 py-4 text-lg font-semibold uppercase tracking-widest text-slate-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Itinerary"}
      </button>
    </form>
  );
}

