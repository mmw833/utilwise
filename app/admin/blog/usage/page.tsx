import {redirect} from "next/navigation";
import Link from "next/link";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import AdminToolUsageAnalytics from "@/components/AdminToolUsageAnalytics";
import {isAdminAuthenticated} from "@/lib/blog/admin-auth";
export const dynamic="force-dynamic";
export const metadata={title:"도구 사용량 분석 | UTILWISE",robots:{index:false,follow:false}};
export default async function AdminToolUsagePage(){
 if(!(await isAdminAuthenticated()))redirect("/admin/blog/login");
 return <main className="admin-dashboard-page"><section className="admin-dashboard-card blog-admin-dashboard"><div className="admin-dashboard-header"><div><p className="admin-dashboard-eyebrow">UTILWISE ANALYTICS</p><h1>도구 사용량 분석</h1><p>도구별 실제 이용 현황을 확인합니다.</p></div><div className="blog-admin-header-actions"><Link href="/admin/blog" className="blog-admin-secondary">블로그 관리</Link><AdminLogoutButton/></div></div><AdminToolUsageAnalytics/></section></main>;
}
