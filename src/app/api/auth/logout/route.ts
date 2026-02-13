import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  const cookie = clearSession();
  response.cookies.set(cookie.name, cookie.value, cookie.options);
  return response;
}
