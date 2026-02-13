import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireTenant } from "@/lib/tenant";

const createFixedCostSchema = z.object({
  name: z.string().trim().min(1).max(120),
  amount: z.coerce.number().int().nonnegative(),
});

type FixedCostRecord = {
  id: string;
  name: string;
  amount: number;
  createdAt: Date;
};

type PrismaFixedCosts = {
  fixedCost: {
    findMany: (args: {
      where: { restaurantId: string };
      orderBy: { createdAt: "desc" };
    }) => Promise<FixedCostRecord[]>;
    create: (args: {
      data: { restaurantId: string; name: string; amount: number };
    }) => Promise<FixedCostRecord>;
  };
};

export async function GET() {
  try {
    const { restaurantId } = await requireTenant();
    const prisma = getDb() as unknown as PrismaFixedCosts;

    const fixedCosts = await prisma.fixedCost.findMany({
      where: { restaurantId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(fixedCosts);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { restaurantId } = await requireTenant();
    const parsed = createFixedCostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fixed cost payload" }, { status: 400 });
    }

    const prisma = getDb() as unknown as PrismaFixedCosts;
    const created = await prisma.fixedCost.create({
      data: {
        restaurantId,
        name: parsed.data.name,
        amount: parsed.data.amount,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
