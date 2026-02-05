import ReactECharts from "echarts-for-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const option = {
  tooltip: { trigger: "axis" },
  legend: { data: ["Revenue", "Occupancy"] },
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: { type: "value" },
  series: [
    {
      name: "Revenue",
      type: "line",
      smooth: true,
      data: [4200, 4600, 4400, 5000, 5400, 6200, 6900],
    },
    {
      name: "Occupancy",
      type: "line",
      smooth: true,
      data: [62, 65, 59, 71, 75, 82, 79],
    },
  ],
};

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Revenue and occupancy trends across the week.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Weekly performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactECharts option={option} style={{ height: 420 }} />
        </CardContent>
      </Card>
    </div>
  );
}
