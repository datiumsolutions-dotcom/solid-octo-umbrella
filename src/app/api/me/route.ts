import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth/requireAuth";

type PrismaAuth = {
  user: {
    findFirst: (args: {
      where: { id: string; restaurantId: string };
      select: { id: true; email: true; role: true; restaurantId: true };
    }) => Promise<{ id: string; email: string; role: "OWNER" | "STAFF"; restaurantId: string } | null>;
  };
};

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (auth instanceof NextResponse) {
    return auth;
  }

  const prisma = getDb() as unknown as PrismaAuth;
  const user = await prisma.user.findFirst({
    where: {
      id: auth.userId,
      restaurantId: auth.restaurantId,
    },
    select: {
      id: true,
      email: true,
      role: true,
      restaurantId: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    userId: user.id,
    email: user.email,
    role: user.role,
    restaurantId: user.restaurantId,
  });
}
