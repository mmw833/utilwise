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

  const configured = await isAdminAuthConfigured();
  const authStatus = await getAdminAuthStatus();
  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <a href="/" className="admin-login-brand">UTILWISE</a>
        <h1>블로그 관리자 로그인</h1>
        <p>관리자 비밀번호를 입력하면 블로그 관리 화면으로 이동합니다.</p>
        {configured ? (
          <AdminLoginForm />
        ) : (
          <div className="admin-login-notice" role="alert">
            관리자 비밀번호 설정을 확인할 수 없습니다.
            <ul>
              {!authStatus.passwordPresent && <li>ADMIN_PASSWORD가 Worker 요청 환경에 전달되지 않았습니다.</li>}
              {authStatus.passwordPresent && !authStatus.passwordLengthValid && <li>ADMIN_PASSWORD는 보안을 위해 12자 이상이어야 합니다.</li>}
            </ul>
            <details style={{ marginTop: "1rem" }}>
              <summary>안전 진단 정보</summary>
              <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.8rem" }}>{JSON.stringify(authStatus.diagnostics, null, 2)}</pre>
            </details>
            비밀번호 값은 화면이나 로그에 표시하지 않습니다.
          </div>
        )}
        <a className="admin-login-home" href="/">사이트로 돌아가기</a>
      </section>
    </main>
  );
}
