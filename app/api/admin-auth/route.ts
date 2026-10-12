import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_SECONDS,
  createAdminSession,
  credentialsAreValid,
} from "../../admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { login?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Login va parolni kiriting" }, { status: 400 });
  }

  const valid = await credentialsAreValid(String(body.login || ""), String(body.password || ""));
  if (!valid) return NextResponse.json({ error: "Login yoki parol noto‘g‘ri" }, { status: 401 });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSession(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}

export async function GET(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/", req.url));
  response.cookies.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  return response;
}
