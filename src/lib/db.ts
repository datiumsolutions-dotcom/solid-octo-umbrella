type PrismaLikeClient = Record<string, unknown>;

type GlobalForPrisma = {
  prisma: PrismaLikeClient | undefined;
};

function createClient(): PrismaLikeClient {
  const req = eval("require") as (id: string) => { PrismaClient: new () => PrismaLikeClient };
  const { PrismaClient } = req("@prisma/client");
  return new PrismaClient();
}

export function getDb(): PrismaLikeClient {
  const globalForPrisma = globalThis as unknown as GlobalForPrisma;

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createClient();
  }

  return globalForPrisma.prisma;
}
