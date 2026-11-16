import { NextRequest, NextResponse } from "next/server";
import { isBlogAgentAuthorized } from "@/lib/blog/agent-auth";
import {
  findOrCreateAdminCategory,
  listAdminPosts,
  saveAdminPost,
  type AdminPostInput,
} from "@/lib/blog/admin-posts";

export const dynamic = "force-dynamic";

function response(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "Pragma": "no-cache" },
  });
}

function validPost(value: unknown): value is AdminPostInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const post = value as Record<string, unknown>;
  return (
    (post.language === "ko" || post.language === "en") &&
    (post.id === undefined || (typeof post.id === "string" && /^[0-9a-f-]{36}$/i.test(post.id))) &&
    typeof post.title === "string" &&
    post.title.trim().length > 0 &&
    post.title.length <= 180 &&
    (post.excerpt === undefined || (typeof post.excerpt === "string" && post.excerpt.length <= 500)) &&
    typeof post.content_md === "string" &&
    post.content_md.length <= 100_000 &&
    (post.status === "draft" || post.status === "published" || post.status === "archived") &&
    (post.seo_title === undefined || post.seo_title === null || (typeof post.seo_title === "string" && post.seo_title.length <= 180)) &&
    (post.seo_description === undefined || post.seo_description === null || (typeof post.seo_description === "string" && post.seo_description.length <= 300)) &&
    (post.category_id === undefined || post.category_id === null || (typeof post.category_id === "string" && /^[0-9a-f-]{36}$/i.test(post.category_id))) &&
    (post.category_name === undefined || (typeof post.category_name === "string" && post.category_name.trim().length <= 40)) &&
    (post.tags === undefined || (Array.isArray(post.tags) && post.tags.length <= 12 && post.tags.every((tag) => typeof tag === "string" && tag.trim().length > 0 && tag.length <= 30))) &&
    (post.cover_image_key === undefined || post.cover_image_key === null || (typeof post.cover_image_key === "string" && /^blog\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/i.test(post.cover_image_key)))
  );
}

export async function GET(request: NextRequest) {
  if (!(await isBlogAgentAuthorized(request))) return response({ error: "인증이 필요합니다." }, 401);
  try {
    return response({ posts: await listAdminPosts() });
  } catch {
    return response({ error: "게시글 목록을 불러오지 못했습니다." }, 500);
  }
}

export async function POST(request: NextRequest) {
  if (!(await isBlogAgentAuthorized(request))) return response({ error: "인증이 필요합니다." }, 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return response({ error: "요청 형식이 올바르지 않습니다." }, 400);
  }
  if (!validPost(body)) return response({ error: "입력값을 확인해 주세요." }, 400);

  try {
    const categoryId = body.category_name
      ? await findOrCreateAdminCategory(body.category_name, body.language)
      : body.category_id ?? null;
    const id = await saveAdminPost({ ...body, category_id: categoryId });
    const saved = (await listAdminPosts()).find((post) => post.id === id);
    return response({ success: true, id, slug: saved?.slug ?? null, status: saved?.status ?? body.status });
  } catch {
    return response({ error: "저장에 실패했습니다. 기존 게시글 ID와 입력값을 확인해 주세요." }, 409);
  }
}
