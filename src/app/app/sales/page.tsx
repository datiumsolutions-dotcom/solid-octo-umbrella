"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Product = {
  id: string;
  name: string;
  active: boolean;
};

type Sale = {
  id: string;
  productId: string;
  quantity: number;
  channel: "LOCAL" | "DELIVERY";
  date: string;
};

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [date, setDate] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [channel, setChannel] = useState<"LOCAL" | "DELIVERY">("LOCAL");

  async function loadData() {
    const [productsResponse, salesResponse] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/sales"),
    ]);

    if (productsResponse.ok) {
      const nextProducts = ((await productsResponse.json()) as Product[]).filter((item) => item.active);
      setProducts(nextProducts);
      if (!productId && nextProducts.length > 0) {
        setProductId(nextProducts[0].id);
      }
    }

    if (salesResponse.ok) {
      setSales((await salesResponse.json()) as Sale[]);
    }
  }

  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 16));
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    await fetch("/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: new Date(date).toISOString(),
        productId,
        quantity: Number(quantity),
        channel,
      }),
    });

    await loadData();
    setQuantity("1");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
        <p className="text-sm text-muted-foreground">Manual sales entry with tenant-scoped products.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">New sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Date</span>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Product</span>
              <select
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Quantity</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Channel</span>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value as "LOCAL" | "DELIVERY")}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="LOCAL">LOCAL</option>
                <option value="DELIVERY">DELIVERY</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Save sale</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Recent sales</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {sales.map((sale) => (
              <li key={sale.id} className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
                <span>{new Date(sale.date).toLocaleString()}</span>
                <span>{sale.productId}</span>
                <span>x{sale.quantity}</span>
                <span>{sale.channel}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
