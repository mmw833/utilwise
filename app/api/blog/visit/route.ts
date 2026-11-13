import { NextRequest, NextResponse } from "next/server";
import { getBlogDatabase } from "@/lib/blog/db";

export const dynamic = "force-dynamic";
const COOKIE = "uw_blog_visitor";
function token() { const bytes = new Uint8Array(32); crypto.getRandomValues(bytes); return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join(""); }
async function hash(value: string) { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)); return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join(""); }
export async function POST(request: NextRequest) {
  try {
    const current = request.cookies.get(COOKIE)?.value;
    const visitor = current && /^[a-f0-9]{64}$/.test(current) ? current : token();
    const visitorHash = await hash(visitor);
    const now = Math.floor(Date.now() / 1000);
    const day = Math.floor((now + 32400) / 86400) * 86400 - 32400;
    const db = getBlogDatabase();
    await db.prepare("INSERT OR IGNORE INTO blog_site_visitors (visitor_hash, first_seen_at) VALUES (?, ?)").bind(visitorHash, now).run();
    await db.prepare("INSERT OR IGNORE INTO blog_site_visits (visitor_hash, visit_date) VALUES (?, ?)").bind(visitorHash, day).run();
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    if (!current || current !== visitor) response.cookies.set(COOKIE, visitor, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
    return response;
  } catch { return NextResponse.json({ ok: false }, { status: 500, headers: { "Cache-Control": "no-store" } }); }
}