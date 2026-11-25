"use client";

import { useEffect, useState } from "react";

type VisitorStats = { today: number; total: number; source?: "cloudflare"; metric?: "pageViews" };

export default function SiteVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/analytics/visitors", { cache: "no-store" });
        if (!response.ok) {
          if (active) setStats(null);
          return;
        }
        const data = (await response.json()) as VisitorStats;
        if (active && Number.isFinite(data.today) && Number.isFinite(data.total)) setStats(data);
      } catch {
        if (active) setStats(null);
      }
    };

    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 5 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="site-visitor-stats"
      aria-label="Site visitors"
      title="TODAY: page views since midnight Korea Standard Time, counted through the last completed hour. TOTAL: daily page views accumulated since 2026-11-17."
    >
      <span><span className="site-visitor-label">TODAY</span> <strong>{stats ? stats.today.toLocaleString() : "—"}</strong></span>
      <span><span className="site-visitor-label">TOTAL</span> <strong>{stats ? stats.total.toLocaleString() : "—"}</strong></span>
    </div>
  );
}
