import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { readSessionFromRequest, type SessionData } from "@/lib/auth/session";

export async function requireAuth(request: NextRequest): Promise<SessionData | NextResponse> {
  const session = await readSessionFromRequest(request);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return session;
}
