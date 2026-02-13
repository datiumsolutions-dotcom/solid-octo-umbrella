import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Catalog placeholder.</p>
        </div>
        <Button>Add product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Current products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-muted-foreground">
                <tr>
                  <th className="px-2 py-2 font-medium">Name</th>
                  <th className="px-2 py-2 font-medium">Category</th>
                  <th className="px-2 py-2 font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/70">
                  <td className="px-2 py-3">Classic Burger</td>
                  <td className="px-2 py-3 text-muted-foreground">Main</td>
                  <td className="px-2 py-3">$12.000</td>
                </tr>
                <tr>
                  <td className="px-2 py-3">Caesar Salad</td>
                  <td className="px-2 py-3 text-muted-foreground">Healthy</td>
                  <td className="px-2 py-3">$9.800</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
