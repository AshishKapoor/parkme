import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const tiers = [
  {
    name: "Street",
    rate: "$2.50/hr",
    note: "Zone A & B",
  },
  {
    name: "Garage",
    rate: "$4.00/hr",
    note: "Covered parking",
  },
  {
    name: "Event",
    rate: "$12.00/day",
    note: "Stadium + weekends",
  },
];

export function PricingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pricing</h1>
        <p className="text-sm text-muted-foreground">
          Current rate plans across the network.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => (
          <Card key={tier.name}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {tier.name}
                <Badge variant="secondary">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-3xl font-semibold">{tier.rate}</p>
              <p className="text-sm text-muted-foreground">{tier.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
