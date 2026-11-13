import { redirect } from "next/navigation";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import Link from "next/link";
import AdminBlogManager from "@/components/AdminBlogManager";
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
      <section className="admin-dashboard-card blog-admin-dashboard">
        <div className="admin-dashboard-header">
          <div>
            <p className="admin-dashboard-eyebrow">UTILWISE BLOG</p>
            <h1>블로그 관리자</h1>
            <p>게시글 작성과 발행 상태, 조회수를 관리합니다.</p>
          </div>
          <div className="blog-admin-header-actions"><Link href="/blog" className="blog-admin-secondary">일반 블로그 보기 ↗</Link><AdminLogoutButton /></div>
        </div>
        <AdminBlogManager />
      </section>
    </main>
  );
}
