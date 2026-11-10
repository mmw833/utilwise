"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function logout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/admin/logout", { method: "POST", cache: "no-store" });
      router.replace("/admin/blog/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return <button type="button" onClick={logout} disabled={loading}>{loading ? "로그아웃 중..." : "로그아웃"}</button>;
}
