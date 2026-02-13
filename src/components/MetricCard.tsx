import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type MetricCardProps = {
  title: string;
  value: string;
  subtitle?: string;
};

export function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight text-card-foreground">{value}</p>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
