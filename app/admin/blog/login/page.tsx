import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { isAdminAuthenticated, isAdminAuthConfigured } from "@/lib/blog/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminBlogLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/blog");

  const configured = isAdminAuthConfigured();
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <a href="/" className="admin-login-brand">UTILWISE</a>
        <h1>블로그 관리자 로그인</h1>
        <p>관리자 인증 후 블로그 관리 화면에 접근할 수 있습니다.</p>
        {configured ? (
          <AdminLoginForm />
        ) : (
          <div className="admin-login-notice" role="alert">
            관리자 인증 정보가 아직 설정되지 않았습니다. Cloudflare Worker에
            ADMIN_PASSWORD와 ADMIN_SESSION_SECRET을 등록해야 합니다.
          </div>
        )}
        <a className="admin-login-home" href="/">사이트로 돌아가기</a>
      </section>
    </main>
  );
}
