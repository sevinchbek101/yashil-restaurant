import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminPanel from "./panel";
import { ADMIN_SESSION_COOKIE, verifyAdminSession } from "../admin-auth";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifyAdminSession(session))) redirect("/admin/login");

  return <AdminPanel user="admin" signout="/api/admin-auth?logout=1"/>;
}
