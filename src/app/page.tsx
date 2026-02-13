import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="card-surface w-full max-w-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">ControlRent</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Restaurant profitability control</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Base44-like app shell is ready. Continue to dashboard.
        </p>
        <div className="mt-6">
          <Link href="/app/dashboard">
            <Button>Go to dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
