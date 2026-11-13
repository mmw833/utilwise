"use client";

import { useEffect } from "react";

export default function BlogViewTracker({ language, slug }: { language: "ko" | "en"; slug: string }) {
  useEffect(() => {
    void fetch("/api/blog/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language, slug }),
      keepalive: true,
    }).catch(() => undefined);
  }, [language, slug]);
  return null;
}
