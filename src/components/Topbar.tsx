"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

type MeResponse = {
  userId: string;
  email: string;
  role: "OWNER" | "STAFF";
  restaurantId: string;
};

export function Topbar() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("Loading...");

  useEffect(() => {
    let active = true;

    async function loadMe() {
      const response = await fetch("/api/me");
      if (!active) {
        return;
      }

      if (!response.ok) {
        setEmail("Unknown user");
        return;
      }

      const data = (await response.json()) as MeResponse;
      setEmail(data.email);
    }

    void loadMe();

    return () => {
      active = false;
    };
  }, []);

  async function onLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/70 md:px-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Operations</p>
          <p className="text-xs text-muted-foreground">Base44-like shell preview</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="hidden text-xs text-muted-foreground sm:block">{email}</p>
          <Button variant="secondary" size="sm" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
