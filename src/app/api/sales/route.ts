import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "@/lib/db";
import { requireTenant } from "@/lib/tenant";

const createSaleSchema = z.object({
  date: z.string().datetime(),
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
  channel: z.enum(["LOCAL", "DELIVERY"]),
});

type SaleRecord = {
  id: string;
  productId: string;
  date: Date;
  quantity: number;
  channel: "LOCAL" | "DELIVERY";
  createdAt: Date;
};

type PrismaSales = {
  product: {
    findFirst: (args: { where: { id: string; restaurantId: string; active: boolean } }) => Promise<{ id: string } | null>;
  };
  sale: {
    findMany: (args: {
      where: { restaurantId: string; date?: { gte?: Date; lte?: Date } };
      orderBy: { date: "desc" };
      take: number;
    }) => Promise<SaleRecord[]>;
    create: (args: {
      data: {
        restaurantId: string;
        productId: string;
        date: Date;
        quantity: number;
        channel: "LOCAL" | "DELIVERY";
      };
    }) => Promise<SaleRecord>;
  };
};

export async function GET(request: NextRequest) {
  try {
    const { restaurantId } = await requireTenant();
    const searchParams = request.nextUrl.searchParams;
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (from) {
      const fromDate = new Date(from);
      if (Number.isNaN(fromDate.getTime())) {
        return NextResponse.json({ error: "Invalid from date" }, { status: 400 });
      }
      dateFilter.gte = fromDate;
    }
    if (to) {
      const toDate = new Date(to);
      if (Number.isNaN(toDate.getTime())) {
        return NextResponse.json({ error: "Invalid to date" }, { status: 400 });
      }
      dateFilter.lte = toDate;
    }

    const prisma = getDb() as unknown as PrismaSales;
    const sales = await prisma.sale.findMany({
      where: {
        restaurantId,
        ...(from || to ? { date: dateFilter } : {}),
      },
      orderBy: { date: "desc" },
      take: 100,
    });

    return NextResponse.json(sales);
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const { restaurantId } = await requireTenant();
    const parsed = createSaleSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid sale payload" }, { status: 400 });
    }

    const prisma = getDb() as unknown as PrismaSales;
    const product = await prisma.product.findFirst({
      where: {
        id: parsed.data.productId,
        restaurantId,
        active: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const created = await prisma.sale.create({
      data: {
        restaurantId,
        productId: parsed.data.productId,
        date: new Date(parsed.data.date),
        quantity: parsed.data.quantity,
        channel: parsed.data.channel,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
