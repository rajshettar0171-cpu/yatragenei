"use client";

import { useEffect, useMemo, useState } from "react";
import { TripForm } from "@/components/TripForm";
import { ItineraryCard } from "@/components/ItineraryCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { ChatModal, ChatMessage } from "@/components/ChatModal";
import { AdminPanel } from "@/components/AdminPanel";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import {
  Alert,
  DayPlan,
  DestinationMeta,
  DestinationSnapshot,
  ItineraryResponse,
  ScrapedFeed,
} from "@/lib/types";

// API base URL - set via environment variable in production
// Falls back to localhost for local development
const API_BASE = 
  typeof window !== "undefined" 
    ? (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000")
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function HomePage() {
  const [destinations, setDestinations] = useState<DestinationMeta[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("shimla");
  const [destinationSnapshot, setDestinationSnapshot] = useState<DestinationSnapshot | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [itinerary, setItinerary] = useState<ItineraryResponse | null>(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [scrapedFeed, setScrapedFeed] = useState<ScrapedFeed | null>(null);
  const [taggingId, setTaggingId] = useState<string | null>(null);
  const [adminStatus, setAdminStatus] = useState<string | undefined>();
  const [adminFilter, setAdminFilter] = useState<string>("");
  const [lastFormInterests, setLastFormInterests] = useState<string[]>(["trekking", "photography"]);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/destinations`);
        if (!response.ok) {
          throw new Error(`Failed to load destinations: ${response.status}`);
        }
        const data = await response.json();
        const list: DestinationMeta[] = data.destinations ?? [];
        setDestinations(list);
        const defaultId =
          list.find((dest) => dest.id === "shimla")?.id ?? list[0]?.id ?? "shimla";
        setSelectedDestination(defaultId);
        setAdminFilter(defaultId);
      } catch (error) {
        console.error("Destinations bootstrap error", error);
        setError("Failed to load destinations. Please refresh the page.");
      }
    };
    loadDestinations();
  }, []);

  useEffect(() => {
    if (!selectedDestination) return;
    const loadSnapshot = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/destination/${selectedDestination}`);
        if (!response.ok) {
          throw new Error(`Failed to load destination: ${response.status}`);
        }
        const snapshot = await response.json();
        setDestinationSnapshot(snapshot);
        setAlerts(snapshot.alerts || []);
      } catch (error) {
        console.error("Snapshot error", error);
        setDestinationSnapshot(null);
        setAlerts([]);
      }
    };
    loadSnapshot();
  }, [selectedDestination]);

  useEffect(() => {
    const query = adminFilter ? `?destination=${adminFilter}` : "";
    const loadFeed = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/admin/scraped${query}`);
        if (!response.ok) {
          throw new Error(`Failed to load admin feed: ${response.status}`);
        }
        const feed = await response.json();
        setScrapedFeed(feed);
      } catch (error) {
        console.error("Admin feed error", error);
        setScrapedFeed({ blogs: [], insta: [], alerts: [] });
      }
    };
    loadFeed();
  }, [adminFilter]);

  const [error, setError] = useState<string | null>(null);

  const onGenerate = async (formState: {
    days: number;
    budget: "low" | "medium" | "high";
    traveler_type: string;
    interests: string[];
    month: string;
  }) => {
    setLoadingItinerary(true);
    setError(null);
    try {
      setLastFormInterests(formState.interests);
      const response = await fetch(`${API_BASE}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: selectedDestination,
          days: formState.days,
          budget: formState.budget,
          traveler_type: formState.traveler_type,
          interests: formState.interests,
          month: formState.month,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Failed to generate itinerary" }));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }
      const data = await response.json();
      setItinerary(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate itinerary. Please try again.";
      setError(message);
      console.error("Itinerary generation error:", err);
    } finally {
      setLoadingItinerary(false);
    }
  };

  const handleDownload = () => {
    if (!itinerary) return;
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const destinationName =
      destinationSnapshot?.name ?? destinations.find((d) => d.id === selectedDestination)?.name ?? "itinerary";
    link.download = `${destinationName.toLowerCase().replace(/\\s+/g, "-")}-itinerary.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleChatSend = async (message: string) => {
    setChatMessages((prev) => [...prev, { role: "user", text: message }]);
    setChatLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          context: {
            ...(itinerary?.summary ?? {}),
            destinationId:
              (itinerary?.summary?.destinationId as string | undefined) ?? selectedDestination,
            interests:
              (itinerary?.summary?.interests as string[] | undefined) ?? lastFormInterests,
          },
        }),
      });
      if (!response.ok) {
        throw new Error(`Chat error: ${response.status}`);
      }
      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: data.reply || "Sorry, I couldn't process that request." },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", text: `Error: ${errorMessage}. Please try again.` },
      ]);
      console.error("Chat error:", err);
    } finally {
      setChatLoading(false);
    }
  };

  const handleTagHiddenGem = async (itemId: string) => {
    setTaggingId(itemId);
    setAdminStatus(undefined);
    try {
      const destinationId = adminFilter || selectedDestination;
      const response = await fetch(`${API_BASE}/api/admin/tag`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, destinationId }),
      });
      if (!response.ok) {
        throw new Error(`Failed to tag hidden gem: ${response.status}`);
      }
      const data = await response.json();
      setAdminStatus(`Hidden gem boost applied for ${data.destinationId || destinationId}.`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to tag hidden gem";
      setAdminStatus(`Error: ${message}`);
      console.error("Tag hidden gem error:", err);
    } finally {
      setTaggingId(null);
    }
  };

  const heroItinerary = useMemo(() => itinerary?.days ?? [], [itinerary]);

  return (
    <main className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <section className="glass-panel relative overflow-hidden rounded-3xl p-8 shadow-card">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-amber-500/10 via-transparent to-blue-500/10" />
        <p className="text-xs uppercase tracking-[0.7em] text-amber-200">
          Active destination · {destinationSnapshot?.name ?? "loading..."}
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">
          AI travel assistant stitching alerts, hidden gems, and offline itineraries across India.
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          {destinationSnapshot?.summary ??
            "Pick a destination to see how we blend mock RAG data with deterministic planning."}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-400">
          <Badge>Itinerary generator</Badge>
          <Badge>Live alerts</Badge>
          <Badge>Offline JSON</Badge>
          <Badge>Admin tagging</Badge>
        </div>
        {destinationSnapshot && (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <SummaryBadge label="Best time" value={destinationSnapshot.bestTime ?? "Flexible"} />
            <SummaryBadge label="Road trip cue" value={destinationSnapshot.roadTripPlan} />
          </div>
        )}
      </section>

      {error && (
        <div className="glass-panel rounded-3xl border border-red-500/50 bg-red-500/10 p-4 shadow-card">
          <div className="flex items-center justify-between">
            <p className="text-red-200">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-200"
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <TripForm
        loading={loadingItinerary}
        destinations={destinations}
        selectedDestination={selectedDestination}
        onDestinationChange={(id) => {
          setSelectedDestination(id);
          setAdminFilter(id);
          setItinerary(null);
          setDestinationSnapshot(null);
          setError(null);
        }}
        onSubmit={onGenerate}
      />

      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <header className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-semibold text-white">Itinerary intelligence</h2>
            <div className="flex gap-3">
              <button
                disabled={!itinerary}
                onClick={handleDownload}
                className="rounded-2xl border border-slate-600 px-4 py-2 text-sm uppercase tracking-[0.3em] text-slate-200 disabled:opacity-30"
              >
                Save offline (JSON)
              </button>
              <button
                onClick={() => setChatOpen(true)}
                className="rounded-2xl bg-emerald-500/20 px-4 py-2 text-sm uppercase tracking-[0.3em] text-emerald-200"
              >
                Ask assistant
              </button>
            </div>
          </header>

          {loadingItinerary && <LoadingSkeleton />}
          {!loadingItinerary && heroItinerary.length === 0 && (
            <p className="text-sm text-slate-400">
              Generate a plan to unlock day-by-day strategy, crowd intel, and food pairings.
            </p>
          )}

          {!loadingItinerary &&
            heroItinerary.map((day: DayPlan) => <ItineraryCard key={day.day} day={day} />)}

          {itinerary && (
            <section className="glass-panel rounded-3xl p-6 shadow-card">
              <h3 className="text-xl font-semibold text-white">Why this itinerary works</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <SummaryBadge
                  label="Traveler Type"
                  value={String(itinerary.summary.travelerType)}
                />
                <SummaryBadge label="Budget Strategy" value={String(itinerary.summary.costEstimate)} />
                <SummaryBadge
                  label="Interest Anchors"
                  value={
                    Array.isArray(itinerary.summary.interests)
                      ? (itinerary.summary.interests as string[]).join(", ")
                      : "Custom mix"
                  }
                />
                <SummaryBadge
                  label="Safety Touchpoints"
                  value={`${itinerary.summary.alertsApplied} alerts monitored`}
                />
                <SummaryBadge
                  label="Road Trip Plan"
                  value={String(itinerary.summary.roadTripPlan)}
                />
                <SummaryBadge label="Bike Plan" value={String(itinerary.summary.bikePlan)} />
                <SummaryBadge
                  label="Food Highlights"
                  value={String(itinerary.summary.foodHighlights)}
                />
                <SummaryBadge
                  label="Adventure Highlights"
                  value={String(itinerary.summary.adventureHighlights)}
                />
                <SummaryBadge
                  label="Hidden Gem"
                  value={String(itinerary.summary.hiddenGemCallout)}
                />
              </div>
            </section>
          )}
        </div>
        <AlertsPanel alerts={alerts} />
      </div>

      <AdminPanel
        feed={scrapedFeed}
        taggingId={taggingId}
        onTagHiddenGem={handleTagHiddenGem}
        statusMessage={adminStatus}
        destinations={destinations}
        filterDestination={adminFilter}
        onFilterChange={(id) => setAdminFilter(id)}
      />

      <ChatModal
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        onSend={handleChatSend}
        messages={chatMessages}
        loading={chatLoading}
      />
    </main>
  );
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
      {children}
    </span>
  );
}

function SummaryBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</p>
      <p className="text-sm text-white">{value}</p>
    </div>
  );
}

