import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/blog/admin-auth";
import { getBlogImageBucket } from "@/lib/blog/db";
export const dynamic = "force-dynamic";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES = {
  "image/jpeg": { ext: "jpg", test: (b: Uint8Array) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  "image/png": { ext: "png", test: (b: Uint8Array) => [137,80,78,71,13,10,26,10].every((v,i) => b[i] === v) },
  "image/webp": { ext: "webp", test: (b: Uint8Array) => String.fromCharCode(...b.slice(0,4)) === "RIFF" && String.fromCharCode(...b.slice(8,12)) === "WEBP" },
  "image/avif": { ext: "avif", test: (b: Uint8Array) => String.fromCharCode(...b.slice(4,8)) === "ftyp" && ["avif","avis","mif1"].includes(String.fromCharCode(...b.slice(8,12))) },
} as const;
function json(data: unknown, status=200) { return NextResponse.json(data,{status,headers:{"Cache-Control":"no-store"}}); }
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return json({error:"인증이 필요합니다."},401);
  const origin=request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({error:"요청을 확인할 수 없습니다."},403);
  let form: FormData;
  try { form=await request.formData(); } catch { return json({error:"파일 업로드 형식이 올바르지 않습니다."},400); }
  const file=form.get("file");
  if (!(file instanceof File)) return json({error:"이미지 파일을 선택해 주세요."},400);
  if (file.size < 1 || file.size > MAX_BYTES) return json({error:"이미지는 5MB 이하의 파일만 업로드할 수 있습니다."},400);
  const type=TYPES[file.type as keyof typeof TYPES];
  if (!type) return json({error:"JPG, PNG, WebP, AVIF 파일만 지원합니다."},400);
  const bytes=new Uint8Array(await file.arrayBuffer());
  if (!type.test(bytes)) return json({error:"파일 내용이 이미지 형식과 일치하지 않습니다."},400);
  const key=`blog/${crypto.randomUUID()}.${type.ext}`;
  try {
    await getBlogImageBucket().put(key,bytes,{httpMetadata:{contentType:file.type,cacheControl:"public, max-age=31536000, immutable"}});
    return json({key,url:`/api/blog/images/${key}`},201);
  } catch { return json({error:"이미지 저장소에 업로드하지 못했습니다. R2 연결을 확인해 주세요."},503); }
}
