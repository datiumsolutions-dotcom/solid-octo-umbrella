import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Restaurant configuration placeholder.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-foreground">Restaurant settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Fields for business profile, timezone and preferences will live here.</p>
        </CardContent>
      </Card>
    </div>
  );
}
