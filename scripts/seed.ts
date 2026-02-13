// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const restaurantName = "Demo Bistro";

  await prisma.sale.deleteMany({});
  await prisma.productCost.deleteMany({});
  await prisma.fixedCost.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.restaurant.deleteMany({ where: { name: restaurantName } });

  const restaurant = await prisma.restaurant.create({
    data: {
      name: restaurantName,
      users: {
        create: {
          email: "owner@demo.local",
          passwordHash: "demo-hash-change-me",
          role: "OWNER",
        },
      },
    },
  });

  const [burger, pizza, salad] = await Promise.all([
    prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        name: "Classic Burger",
        category: "Main",
        price: 12000,
      },
    }),
    prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        name: "Napolitan Pizza",
        category: "Main",
        price: 14500,
      },
    }),
    prisma.product.create({
      data: {
        restaurantId: restaurant.id,
        name: "Caesar Salad",
        category: "Healthy",
        price: 9800,
      },
    }),
  ]);

  await prisma.productCost.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        productId: burger.id,
        rawMaterialCost: 4200,
        packagingCost: 500,
        deliveryFeePct: 10,
      },
      {
        restaurantId: restaurant.id,
        productId: pizza.id,
        rawMaterialCost: 5100,
        packagingCost: 700,
        deliveryFeePct: 12,
      },
      {
        restaurantId: restaurant.id,
        productId: salad.id,
        rawMaterialCost: 3100,
        packagingCost: 350,
        deliveryFeePct: 8,
      },
    ],
  });

  await prisma.fixedCost.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        name: "Rent",
        amount: 350000,
      },
      {
        restaurantId: restaurant.id,
        name: "Utilities",
        amount: 90000,
      },
    ],
  });

  await prisma.sale.createMany({
    data: [
      {
        restaurantId: restaurant.id,
        productId: burger.id,
        date: new Date("2026-02-10T12:00:00.000Z"),
        quantity: 18,
        channel: "LOCAL",
      },
      {
        restaurantId: restaurant.id,
        productId: pizza.id,
        date: new Date("2026-02-10T21:00:00.000Z"),
        quantity: 11,
        channel: "DELIVERY",
      },
      {
        restaurantId: restaurant.id,
        productId: salad.id,
        date: new Date("2026-02-11T13:00:00.000Z"),
        quantity: 7,
        channel: "LOCAL",
      },
      {
        restaurantId: restaurant.id,
        productId: burger.id,
        date: new Date("2026-02-11T20:30:00.000Z"),
        quantity: 9,
        channel: "DELIVERY",
      },
    ],
  });

  console.log(`Seeded restaurant ${restaurant.name} (${restaurant.id})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
