import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SalesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Sales</h1>
        <p className="text-sm text-muted-foreground">Record a sale (placeholder).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">New sale</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Date</span>
              <input type="date" className="w-full rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Product</span>
              <input type="text" placeholder="Select product" className="w-full rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Quantity</span>
              <input type="number" min="1" defaultValue="1" className="w-full rounded-md border border-input bg-background px-3 py-2" />
            </label>
            <label className="text-sm">
              <span className="mb-1 block text-muted-foreground">Channel</span>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                <option>LOCAL</option>
                <option>DELIVERY</option>
              </select>
            </label>
            <div className="sm:col-span-2">
              <Button type="button">Save sale</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
