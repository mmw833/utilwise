import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getBlogDatabase } from "@/lib/blog/db";
import { recordPostView } from "@/lib/blog/posts";

export const dynamic = "force-dynamic";
const COOKIE_NAME = "uw_blog_visitor";

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
    const token = existing && /^[a-f0-9]{64}$/.test(existing) ? existing : randomBytes(32).toString("hex");
    const visitorHash = createHash("sha256").update(token).digest("hex");
    await recordPostView(post.id, visitorHash);
    const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
    if (!existing || existing !== token) response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
