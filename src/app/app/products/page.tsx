"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Product = {
  id: string;
  name: string;
  category: string | null;
  price: number;
  active: boolean;
};

export default function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function loadProducts() {
    const response = await fetch("/api/products");
    if (response.ok) {
      setItems((await response.json()) as Product[]);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProducts();
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, category, price: Number(price) }),
    });

    if (!response.ok) {
      setError("Could not create product");
      return;
    }

    setName("");
    setCategory("");
    setPrice("");
    await loadProducts();
  }

  async function onToggleActive(item: Product) {
    await fetch(`/api/products/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !item.active }),
    });

    await loadProducts();
  }

  async function onQuickEdit(item: Product) {
    const nextName = window.prompt("Name", item.name);
    if (!nextName) {
      return;
    }

    const nextPrice = window.prompt("Price", String(item.price));
    if (!nextPrice) {
      return;
    }

    await fetch(`/api/products/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nextName, price: Number(nextPrice) }),
    });

    await loadProducts();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-muted-foreground">Real product catalog scoped to your restaurant.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Add product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-3 sm:grid-cols-4">
            <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="number" min="0" className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <Button type="submit">Create</Button>
          </form>
          {error ? <p className="mt-2 text-sm text-destructive">{error}</p> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Products list</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-2 py-2">Name</th>
                  <th className="px-2 py-2">Category</th>
                  <th className="px-2 py-2">Price</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-border/70">
                    <td className="px-2 py-2">{item.name}</td>
                    <td className="px-2 py-2 text-muted-foreground">{item.category ?? "-"}</td>
                    <td className="px-2 py-2">${item.price}</td>
                    <td className="px-2 py-2">{item.active ? "Active" : "Inactive"}</td>
                    <td className="px-2 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="secondary" type="button" onClick={() => onQuickEdit(item)}>Edit</Button>
                        <Button size="sm" variant="ghost" type="button" onClick={() => onToggleActive(item)}>
                          {item.active ? "Deactivate" : "Activate"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
