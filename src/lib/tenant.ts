import { readSession } from "@/lib/auth/session";

export async function requireTenant() {
  const session = await readSession();

  if (!session) {
    throw new Error("Unauthorized");
  }

  return {
    userId: session.userId,
    restaurantId: session.restaurantId,
    role: session.role,
  };
}
