// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = globalThis as { prisma: any | undefined };

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
