"use client";
import { useEffect } from "react";
export default function BlogVisitorTracker() {
  useEffect(() => { void fetch("/api/blog/visit", { method: "POST", keepalive: true }).catch(() => undefined).finally(() => window.dispatchEvent(new Event("uw:visitor-tracked"))); }, []);
  return null;
}
