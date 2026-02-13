"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type FixedCost = {
  id: string;
  name: string;
  amount: number;
};

export function FixedCostsClient() {
  const [items, setItems] = useState<FixedCost[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadFixedCosts() {
    const response = await fetch("/api/fixed-costs", { credentials: "same-origin" });
    if (response.ok) {
      setItems((await response.json()) as FixedCost[]);
    }
  }

  useEffect(() => {
    void loadFixedCosts();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const response = await fetch("/api/fixed-costs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name, amount: Number(amount) }),
    });

    if (!response.ok) {
      setError("Could not create fixed cost");
      setLoading(false);
      return;
    }

    setName("");
    setAmount("");
    await loadFixedCosts();
    setLoading(false);
  }

  async function onEdit(item: FixedCost) {
    const nextName = window.prompt("Name", item.name);
    if (!nextName) {
      return;
    }

    const nextAmount = window.prompt("Amount", String(item.amount));
    if (!nextAmount) {
      return;
    }

    await fetch(`/api/fixed-costs/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ name: nextName, amount: Number(nextAmount) }),
    });

    await loadFixedCosts();
  }

  async function onDelete(item: FixedCost) {
    await fetch(`/api/fixed-costs/${item.id}`, { method: "DELETE", credentials: "same-origin" });
    await loadFixedCosts();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Fixed Costs</h1>
        <p className="text-sm text-muted-foreground">Manage monthly fixed costs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Add fixed cost</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-3">
            <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" min="0" className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
          </form>
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Cost items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
                <span>{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium">${item.amount}</span>
                  <Button size="sm" variant="secondary" type="button" onClick={() => onEdit(item)}>Edit</Button>
                  <Button size="sm" variant="ghost" type="button" onClick={() => onDelete(item)}>Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
