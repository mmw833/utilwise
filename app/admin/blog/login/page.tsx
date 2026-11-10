import { redirect } from "next/navigation";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAdminAuthStatus, isAdminAuthenticated, isAdminAuthConfigured } from "@/lib/blog/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "관리자 로그인 | UTILWISE",
  robots: { index: false, follow: false },
};

export default async function AdminBlogLoginPage() {
  if (await isAdminAuthenticated()) redirect("/admin/blog");

  const configured = isAdminAuthConfigured();
  const authStatus = getAdminAuthStatus();
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
            관리자 로그인 설정을 확인할 수 없습니다.
            <ul>
              {!authStatus.passwordPresent && <li>ADMIN_PASSWORD 값이 Worker에 전달되지 않았습니다.</li>}
              {authStatus.passwordPresent && !authStatus.passwordLengthValid && <li>ADMIN_PASSWORD는 보안을 위해 12자 이상이어야 합니다.</li>}
              {!authStatus.sessionSecretPresent && <li>ADMIN_SESSION_SECRET 값이 Worker에 전달되지 않았습니다.</li>}
              {authStatus.sessionSecretPresent && !authStatus.sessionSecretLengthValid && <li>ADMIN_SESSION_SECRET은 32자 이상이어야 합니다.</li>}
            </ul>
            비밀값 자체는 화면이나 로그에 표시하지 않습니다.
          </div>
        )}
        <a className="admin-login-home" href="/">사이트로 돌아가기</a>
      </section>
    </main>
  );
}
