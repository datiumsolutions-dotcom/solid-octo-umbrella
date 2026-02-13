import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card-surface w-full max-w-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">ControlRent</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Restaurant profitability control</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Sign in to access your dashboard.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/login">
            <Button>Go to login</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Create account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
