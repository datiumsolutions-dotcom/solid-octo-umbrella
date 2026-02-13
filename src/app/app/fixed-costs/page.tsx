import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function FixedCostsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Fixed Costs</h1>
        <p className="text-sm text-muted-foreground">Monthly baseline costs.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Cost items</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
              <span>Rent</span>
              <span className="font-medium">$350.000</span>
            </li>
            <li className="flex items-center justify-between rounded-md bg-secondary px-3 py-2">
              <span>Utilities</span>
              <span className="font-medium">$90.000</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
