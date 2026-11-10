import { NextRequest, NextResponse } from "next/server";
import {
  adminSessionCookie,
  createAdminSession,
  getAdminSessionCookieName,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from "@/lib/blog/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "요청을 확인할 수 없습니다." }, { status: 403 });
  }

  if (!(await isAdminAuthConfigured())) {
    return NextResponse.json(
      { error: "관리자 인증 설정이 완료되지 않았습니다. 운영 환경 설정을 확인해 주세요." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  }

  if (!(await verifyAdminPassword(password))) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminSessionCookieName(), await createAdminSession(), adminSessionCookie);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
