import { NextRequest, NextResponse } from "next/server";
import { getBlogDatabase } from "@/lib/blog/db";
import { recordPostView } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
const COOKIE_NAME = "uw_blog_visitor";

function randomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ ok: false }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  const { language, slug } = body as Record<string, unknown>;
  if ((language !== "ko" && language !== "en") || typeof slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 120) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  try {
    const db = getBlogDatabase();
    const post = await db.prepare("SELECT id FROM blog_posts WHERE language = ? AND slug = ? AND status = 'published' LIMIT 1").bind(language, slug).first<{ id: string }>();
    if (!post) return NextResponse.json({ ok: false }, { status: 404 });
    const existing = request.cookies.get(COOKIE_NAME)?.value;
    const token = existing && /^[a-f0-9]{64}$/.test(existing) ? existing : randomToken();
    await recordPostView(post.id, await hashToken(token));
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    if (!existing || existing !== token) response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
