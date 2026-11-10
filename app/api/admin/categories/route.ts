import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/blog/admin-auth";
import {
  createAdminCategory,
  listAdminCategories,
} from "@/lib/blog/admin-posts";

export const dynamic = "force-dynamic";

function response(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return response({ error: "인증이 필요합니다." }, 401);
  try {
    return response({ categories: await listAdminCategories() });
  } catch {
    return response({ error: "카테고리를 불러오지 못했습니다." }, 500);
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return response({ error: "인증이 필요합니다." }, 401);
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return response({ error: "요청을 확인할 수 없습니다." }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response({ error: "요청 형식이 올바르지 않습니다." }, 400);
  }

  const data = body as { name_ko?: unknown; name_en?: unknown } | null;
  if (!data || typeof data.name_ko !== "string" || !data.name_ko.trim() || data.name_ko.trim().length > 40 ||
      (data.name_en !== undefined && (typeof data.name_en !== "string" || data.name_en.length > 40))) {
    return response({ error: "카테고리 이름을 확인해 주세요." }, 400);
  }

  try {
    await createAdminCategory(data.name_ko, typeof data.name_en === "string" ? data.name_en : undefined);
    return response({ success: true, categories: await listAdminCategories() });
  } catch {
    return response({ error: "카테고리 생성에 실패했습니다. 같은 이름이나 주소가 있는지 확인해 주세요." }, 409);
  }
}
