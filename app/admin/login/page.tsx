import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "../../admin-auth";
import AdminLoginForm from "./login-form";

export const dynamic = "force-dynamic";

export default async function AdminLogin() {
  const cookieStore = await cookies();
  if (await verifyAdminSession(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) redirect("/admin");
  return <AdminLoginForm/>;
}
