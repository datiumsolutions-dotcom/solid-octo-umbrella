type PrismaClientLike = {
  $disconnect: () => Promise<void>;
};

type PrismaClientConstructor = new () => PrismaClientLike;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client") as {
  PrismaClient: PrismaClientConstructor;
};

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientLike | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
