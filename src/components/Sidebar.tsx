"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/app/dashboard", label: "Dashboard" },
  { href: "/app/products", label: "Products" },
  { href: "/app/fixed-costs", label: "Fixed Costs" },
  { href: "/app/sales", label: "Sales" },
  { href: "/app/settings", label: "Settings" },
];

function NavContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <div className="px-4 py-5">
        <p className="text-lg font-semibold text-sidebar-foreground">ControlRent</p>
        <p className="text-xs text-sidebar-muted">Profitability cockpit</p>
      </div>
      <nav className="space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm md:hidden"
      >
        Menu
      </button>

      <aside className="hidden w-64 flex-col border-r border-sidebar-accent bg-sidebar md:fixed md:inset-y-0 md:flex">
        <NavContent />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-sidebar-accent bg-sidebar">
            <div className="flex items-center justify-end p-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-sidebar-foreground hover:bg-sidebar-accent"
              >
                Close
              </button>
            </div>
            <NavContent onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}
