import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireTenant } from "@/lib/tenant";

const updateProductSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().max(80).nullable().optional(),
  price: z.coerce.number().int().nonnegative().optional(),
  active: z.boolean().optional(),
});

type PrismaProducts = {
  product: {
    updateMany: (args: {
      where: { id: string; restaurantId: string };
      data: { name?: string; category?: string | null; price?: number; active?: boolean };
    }) => Promise<{ count: number }>;
  };
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { restaurantId } = await requireTenant();
    const { id } = await params;
    const parsed = updateProductSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }

    const data = parsed.data;
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const prisma = getDb() as unknown as PrismaProducts;
    const result = await prisma.product.updateMany({
      where: { id, restaurantId },
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        active: data.active,
      },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
