import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/blog/admin-auth";
import { setFeaturedPost } from "@/lib/blog/admin-posts";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ error: "요청을 확인할 수 없습니다." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 }); }
  const data = body as { id?: unknown; language?: unknown } | null;
  if (!data || typeof data.id !== "string" || data.id.length > 80 || (data.language !== "ko" && data.language !== "en")) return NextResponse.json({ error: "게시글 정보를 확인해 주세요." }, { status: 400 });
  try { await setFeaturedPost(data.id, data.language); return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "발행된 게시글만 대표글로 지정할 수 있습니다." }, { status: 400 }); }
}