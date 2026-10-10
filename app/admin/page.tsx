import { requireChatGPTUser, chatGPTSignOutPath } from "../chatgpt-auth";import AdminPanel from "./panel";
export const dynamic="force-dynamic";
export default async function Admin(){const user=await requireChatGPTUser("/admin");return <AdminPanel user={user.displayName} signout={chatGPTSignOutPath("/")}/>}
