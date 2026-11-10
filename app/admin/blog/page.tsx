import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { isAdminAuthenticated } from "@/lib/blog/admin-auth";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "블로그 관리자 | UTILWISE",
  robots: { index: false, follow: false },
};

export default async function AdminBlogPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin/blog/login");

  return (
    <main className="admin-dashboard-page">
      <section className="admin-dashboard-card">
        <div className="admin-dashboard-header">
          <div>
            <p className="admin-dashboard-eyebrow">UTILWISE BLOG</p>
            <h1>블로그 관리자</h1>
            <p>관리자 인증이 완료되었습니다.</p>
          </div>
          <AdminLogoutButton />
        </div>
        <div className="admin-dashboard-placeholder">
          <h2>관리자 인증 기능이 연결되었습니다.</h2>
          <p>다음 단계에서 게시글 작성, 수정, 발행 및 카테고리 관리 기능을 연결할 예정입니다.</p>
        </div>
      </section>
    </main>
  );
}
