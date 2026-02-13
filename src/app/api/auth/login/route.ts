import { z } from "zod";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

type UserRecord = {
  id: string;
  email: string;
  passwordHash: string;
  restaurantId: string;
  role: "OWNER" | "STAFF";
};

type PrismaAuth = {
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<UserRecord | null>;
  };
};

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }

  const prisma = getDb() as unknown as PrismaAuth;
  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const cookie = await createSessionCookie({
    userId: user.id,
    restaurantId: user.restaurantId,
    role: user.role,
  });
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
