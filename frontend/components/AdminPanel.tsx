"use client";

import { DestinationMeta, ScrapedFeed } from "@/lib/types";

type Props = {
  feed: ScrapedFeed | null;
  taggingId?: string | null;
  onTagHiddenGem: (itemId: string) => Promise<void>;
  statusMessage?: string;
  destinations: DestinationMeta[];
  filterDestination: string;
  onFilterChange: (id: string) => void;
};

export function AdminPanel({
  feed,
  taggingId,
  onTagHiddenGem,
  statusMessage,
  destinations,
  filterDestination,
  onFilterChange,
}: Props) {
  if (!feed) return null;

  const renderItems = (items: any[], type: string) =>
    items.map((item) => (
      <article
        key={item.id}
        className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4"
      >
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{type}</p>
            <h4 className="text-lg font-semibold text-white">
              {item.title || item.source}
            </h4>
          </div>
          {type !== "Alert" && (
            <button
              onClick={() => onTagHiddenGem(item.id)}
              disabled={taggingId === item.id}
              className="rounded-full border border-emerald-400 px-3 py-1 text-xs uppercase tracking-[0.3em] text-emerald-200 disabled:opacity-40"
            >
              {taggingId === item.id ? "Tagging..." : "Mark Hidden Gem"}
            </button>
          )}
        </header>
        <p className="mt-2 text-sm text-slate-300">
          {(item.content || item.description || "").slice(0, 220)}
          {(item.content || item.description || "").length > 220 ? "…" : ""}
        </p>
        {item.destinationId && (
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500">
            {item.destinationId}
          </p>
        )}
        {item.geoTags && (
          <p className="mt-1 text-xs text-slate-500">Geo tags: {item.geoTags.join(", ")}</p>
        )}
      </article>
    ));

  return (
    <section className="glass-panel rounded-3xl p-6 shadow-card">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Content ops</p>
          <h3 className="text-2xl font-semibold text-white">Admin / scraped feed</h3>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-300 md:flex-row md:items-center">
          <label className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Destination</span>
            <select
              value={filterDestination}
              onChange={(event) => onFilterChange(event.target.value)}
              className="rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-white focus:border-amber-400 focus:outline-none"
            >
              <option value="">All</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </label>
          {statusMessage && (
            <span className="text-xs text-emerald-300">{statusMessage}</span>
          )}
        </div>
      </header>

      <div className="space-y-4">
        {renderItems(feed.blogs, "Blog")}
        {renderItems(feed.insta, "Instagram")}
        {renderItems(feed.alerts, "Alert")}
      </div>
    </section>
  );
}

