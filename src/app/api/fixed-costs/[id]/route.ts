import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireTenant } from "@/lib/tenant";

const updateFixedCostSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  amount: z.coerce.number().int().nonnegative().optional(),
});

type PrismaFixedCosts = {
  fixedCost: {
    updateMany: (args: {
      where: { id: string; restaurantId: string };
      data: { name?: string; amount?: number };
    }) => Promise<{ count: number }>;
    deleteMany: (args: { where: { id: string; restaurantId: string } }) => Promise<{ count: number }>;
  };
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { restaurantId } = await requireTenant();
    const { id } = await params;
    const parsed = updateFixedCostSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid fixed cost payload" }, { status: 400 });
    }

    if (Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const prisma = getDb() as unknown as PrismaFixedCosts;
    const result = await prisma.fixedCost.updateMany({
      where: { id, restaurantId },
      data: parsed.data,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Fixed cost not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { restaurantId } = await requireTenant();
    const { id } = await params;
    const prisma = getDb() as unknown as PrismaFixedCosts;

    const result = await prisma.fixedCost.deleteMany({ where: { id, restaurantId } });
    if (result.count === 0) {
      return NextResponse.json({ error: "Fixed cost not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
