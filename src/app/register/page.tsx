"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantName, email, password }),
    });

    if (!response.ok) {
      setError("Unable to register with these credentials");
      setLoading(false);
      return;
    }

    router.push("/app/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card-surface w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start your restaurant workspace.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Restaurant name</span>
            <input
              type="text"
              required
              value={restaurantName}
              onChange={(event) => setRestaurantName(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-muted-foreground">Password</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            />
          </label>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-4 text-sm text-muted-foreground">
          Already registered?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
