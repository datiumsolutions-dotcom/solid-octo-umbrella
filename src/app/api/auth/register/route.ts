import { z } from "zod";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { createSessionCookie } from "@/lib/auth/session";
import { hashPassword } from "@/lib/auth/password";

const registerSchema = z.object({
  restaurantName: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

type PrismaAuth = {
  user: {
    findUnique: (args: { where: { email: string } }) => Promise<{ id: string } | null>;
    create: (args: {
      data: {
        email: string;
        passwordHash: string;
        role: "OWNER";
        restaurantId: string;
      };
    }) => Promise<{ id: string; restaurantId: string; role: "OWNER" }>;
  };
  restaurant: {
    create: (args: { data: { name: string } }) => Promise<{ id: string }>;
  };
};

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const prisma = getDb() as unknown as PrismaAuth;
  const email = parsed.data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "Unable to register with these credentials" }, { status: 400 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const restaurant = await prisma.restaurant.create({
    data: { name: parsed.data.restaurantName },
  });

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      role: "OWNER",
      restaurantId: restaurant.id,
    },
  });

  const response = NextResponse.json({ ok: true });
  const cookie = await createSessionCookie({
    userId: user.id,
    restaurantId: user.restaurantId,
    role: user.role,
  });
  response.cookies.set(cookie.name, cookie.value, cookie.options);

  return response;
}
