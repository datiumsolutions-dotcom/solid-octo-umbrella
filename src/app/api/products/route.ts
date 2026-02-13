import { NextResponse } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireTenant } from "@/lib/tenant";

const createProductSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  price: z.coerce.number().int().nonnegative(),
});

type ProductRecord = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  active: boolean;
  createdAt: Date;
};

type PrismaProducts = {
  product: {
    findMany: (args: {
      where: { restaurantId: string };
      orderBy: Array<{ active: "desc" } | { name: "asc" }>;
    }) => Promise<ProductRecord[]>;
    create: (args: {
      data: { restaurantId: string; name: string; category?: string; price: number; active: boolean };
    }) => Promise<ProductRecord>;
  };
};

export async function GET() {
  try {
    const { restaurantId } = await requireTenant();
    const prisma = getDb() as unknown as PrismaProducts;

    const products = await prisma.product.findMany({
      where: { restaurantId },
      orderBy: [{ active: "desc" }, { name: "asc" }],
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { restaurantId } = await requireTenant();
    const parsed = createProductSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid product payload" }, { status: 400 });
    }

    const prisma = getDb() as unknown as PrismaProducts;
    const created = await prisma.product.create({
      data: {
        restaurantId,
        name: parsed.data.name,
        category: parsed.data.category || undefined,
        price: parsed.data.price,
        active: true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
