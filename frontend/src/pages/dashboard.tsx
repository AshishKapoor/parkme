import { useQuery } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "Active lots", value: "24", delta: "+2 today" },
  { label: "Occupied spots", value: "1,248", delta: "+6%" },
  { label: "Open tickets", value: "38", delta: "-12%" },
  { label: "Revenue", value: "$12.4k", delta: "+9%" },
];

export function DashboardPage() {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
  const { isLoading, isError } = useQuery({
    queryKey: ["api-status"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/api/schema/`);
      if (!response.ok) {
        throw new Error("API unavailable");
      }
      return response.json();
    },
    staleTime: 60_000,
  });

  const apiStatus = isLoading ? "Checking" : isError ? "Offline" : "Connected";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Real-time overview of parking operations.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-2xl font-semibold">{item.value}</span>
              <Badge variant="secondary">{item.delta}</Badge>
            </CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              API status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-2xl font-semibold">{apiStatus}</span>
            <Badge
              variant={apiStatus === "Connected" ? "secondary" : "destructive"}
            >
              {apiStatus}
            </Badge>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s highlights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>Peak occupancy reached at 5:45 PM in Downtown Zone.</p>
          <p>3 new enforcement requests were opened across West Side lots.</p>
          <p>Average session length is holding steady at 1h 24m.</p>
        </CardContent>
      </Card>
    </div>
  );
}
