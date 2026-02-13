"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type FixedCost = {
  id: string;
  name: string;
  amount: number;
};

export default function FixedCostsPage() {
  const [items, setItems] = useState<FixedCost[]>([]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  async function loadFixedCosts() {
    const response = await fetch("/api/fixed-costs");
    if (response.ok) {
      setItems((await response.json()) as FixedCost[]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadFixedCosts();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch("/api/fixed-costs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount: Number(amount) }),
    });

    setName("");
    setAmount("");
    await loadFixedCosts();
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
      body: JSON.stringify({ name: nextName, amount: Number(nextAmount) }),
    });

    await loadFixedCosts();
  }

  async function onDelete(item: FixedCost) {
    await fetch(`/api/fixed-costs/${item.id}`, { method: "DELETE" });
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
            <Button type="submit">Create</Button>
          </form>
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
