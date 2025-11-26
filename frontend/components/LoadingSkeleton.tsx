"use client";

export function LoadingSkeleton() {
  return (
    <div className="glass-panel animate-pulse rounded-3xl p-6 shadow-card">
      <div className="h-6 w-40 rounded bg-slate-800" />
      <div className="mt-4 space-y-3">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="h-24 rounded-2xl bg-slate-900" />
        ))}
      </div>
    </div>
  );
}

