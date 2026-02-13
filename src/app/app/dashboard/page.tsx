import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Today at a glance.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Ventas hoy" value="$ 385.000" subtitle="+12% vs ayer" />
        <MetricCard title="Margen" value="34%" subtitle="Objetivo: 40%" />
        <MetricCard title="Costos fijos" value="$ 440.000" subtitle="Mensual" />
        <MetricCard title="Breakeven" value="$ 1.250.000" subtitle="Facturación estimada" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No insights yet</p>
        </CardContent>
      </Card>
    </div>
  );
}
