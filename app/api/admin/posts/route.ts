import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/blog/admin-auth";
import {
  deleteAdminPost,
  listAdminPosts,
  saveAdminPost,
  type AdminPostInput,
} from "@/lib/blog/admin-posts";

export const dynamic = "force-dynamic";

function noStoreJson(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

function validPost(value: unknown): value is AdminPostInput {
  if (!value || typeof value !== "object") return false;
  const post = value as Record<string, unknown>;
  return (
    (post.language === "ko" || post.language === "en") &&
    typeof post.slug === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) &&
    post.slug.length <= 120 &&
    typeof post.title === "string" &&
    post.title.trim().length > 0 &&
    post.title.length <= 180 &&
    typeof post.excerpt === "string" &&
    post.excerpt.length <= 500 &&
    typeof post.content_md === "string" &&
    post.content_md.length <= 100_000 &&
    (post.status === "draft" || post.status === "published" || post.status === "archived") &&
    (!post.id || typeof post.id === "string") &&
    (!post.category_id || typeof post.category_id === "string") &&
    (post.cover_image_key === undefined || post.cover_image_key === null || (typeof post.cover_image_key === "string" && /^blog\/[0-9a-f-]{36}\.(jpg|png|webp|avif)$/.test(post.cover_image_key)))
  );
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return noStoreJson({ error: "인증이 필요합니다." }, 401);
  try {
    return noStoreJson({ posts: await listAdminPosts() });
  } catch {
    return noStoreJson({ error: "게시글 목록을 불러오지 못했습니다." }, 500);
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return noStoreJson({ error: "인증이 필요합니다." }, 401);
  if (!sameOrigin(request)) return noStoreJson({ error: "요청을 확인할 수 없습니다." }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return noStoreJson({ error: "요청 형식이 올바르지 않습니다." }, 400);
  }
  if (!validPost(body)) return noStoreJson({ error: "입력값을 확인해 주세요." }, 400);

  try {
    const id = await saveAdminPost(body);
    return noStoreJson({ success: true, id });
  } catch {
    return noStoreJson({ error: "저장에 실패했습니다. 주소(slug)가 이미 사용 중인지 확인해 주세요." }, 409);
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return noStoreJson({ error: "인증이 필요합니다." }, 401);
  if (!sameOrigin(request)) return noStoreJson({ error: "요청을 확인할 수 없습니다." }, 403);

  const id = new URL(request.url).searchParams.get("id");
  if (!id || id.length > 80) return noStoreJson({ error: "게시글 정보가 올바르지 않습니다." }, 400);
  try {
    await deleteAdminPost(id);
    return noStoreJson({ success: true });
  } catch {
    return noStoreJson({ error: "삭제에 실패했습니다." }, 500);
  }
}
