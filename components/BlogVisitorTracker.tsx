"use client";
import { useEffect } from "react";
export default function BlogVisitorTracker() {
  useEffect(() => { void fetch("/api/blog/visit", { method: "POST", keepalive: true }).catch(() => undefined); }, []);
  return null;
}
