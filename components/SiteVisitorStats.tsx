"use client";

import { useEffect, useState } from "react";

type VisitorStats = { today: number; total: number; source?: "cloudflare" | "local" | "local-fallback" | "unavailable" };

export default function SiteVisitorStats() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const response = await fetch("/api/analytics/visitors", { cache: "no-store" });
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

  const sourceLabel = stats?.source === "cloudflare"
    ? "TODAY is Cloudflare's unique IP count; TOTAL is the existing lifetime cookie-based count."
    : "Visitor counts are temporarily using the existing browser-cookie counter.";

  return (
    <div className="site-visitor-stats" aria-label="Site visitors" title={sourceLabel}>
      <span><span className="site-visitor-label">TODAY</span> <strong>{stats ? stats.today.toLocaleString() : "—"}</strong></span>
      <span><span className="site-visitor-label">TOTAL</span> <strong>{stats ? stats.total.toLocaleString() : "—"}</strong></span>
    </div>
  );
}
