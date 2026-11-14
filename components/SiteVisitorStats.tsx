"use client";

import { useEffect, useState } from "react";

type VisitorStats = { today: number; total: number };

export default function SiteVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/blog/visit", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as VisitorStats;
        if (active && Number.isFinite(data.today) && Number.isFinite(data.total)) setStats(data);
      } catch {
        // Visitor statistics are non-essential; keep the header clean if unavailable.
      }
    };
    const handleTracked = () => { void refresh(); };
    window.addEventListener("uw:visitor-tracked", handleTracked);
    void refresh();
    return () => {
      active = false;
      window.removeEventListener("uw:visitor-tracked", handleTracked);
    };
  }, []);

  return (
    <div className="site-visitor-stats" aria-label="Site visitors">
      <span><span className="site-visitor-label">TODAY</span> <strong>{stats ? stats.today.toLocaleString() : "—"}</strong></span>
      <span><span className="site-visitor-label">TOTAL</span> <strong>{stats ? stats.total.toLocaleString() : "—"}</strong></span>
    </div>
  );
}
