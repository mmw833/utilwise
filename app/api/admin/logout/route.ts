import { NextResponse } from "next/server";
import { adminSessionCookie, getAdminSessionCookieName } from "@/lib/blog/admin-auth";

export const dynamic = "force-dynamic";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminSessionCookieName(), "", {
    ...adminSessionCookie,
    maxAge: 0,
    expires: new Date(0),
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
