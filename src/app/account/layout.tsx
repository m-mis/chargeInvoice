import { getCookieSession } from "@/utils/cookies-manager";
import { redirect } from "next/navigation";
import PATHS from "@/app/path-config";
import { DashboardLayout } from "@/components/dashboard/layout";

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const cookieSession = await getCookieSession();
  if (!cookieSession) {
    redirect(PATHS.login);
  }
  const locale = await params;
  console.log(locale);
  return <DashboardLayout userName={cookieSession.userName}>{children}</DashboardLayout>;
}
