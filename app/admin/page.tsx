import { requireChatGPTUser, chatGPTSignOutPath, isYashilAdmin } from "../chatgpt-auth";import { redirect } from "next/navigation";import AdminPanel from "./panel";
export const dynamic="force-dynamic";
export default async function Admin(){const user=await requireChatGPTUser("/admin");if(!isYashilAdmin(user.userId))redirect("/");return <AdminPanel user={user.displayName} signout={chatGPTSignOutPath("/")}/>}
