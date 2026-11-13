"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error || "로그인할 수 없습니다.");
        return;
      }
      router.replace("/admin/blog");
      router.refresh();
    } catch {
      setError("연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="admin-login-form">
      <label htmlFor="admin-password">관리자 비밀번호</label>
      <input
        id="admin-password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        minLength={12}
        autoFocus
      />
      {error ? <p role="alert" className="admin-login-error">{error}</p> : null}
      <button type="submit" disabled={loading || password.length < 12}>
        {loading ? "확인 중..." : "로그인"}
      </button>
    </form>
  );
}
