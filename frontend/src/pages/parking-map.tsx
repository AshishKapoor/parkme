import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const center: [number, number] = [37.7749, -122.4194];

const lots = [
  {
    id: "downtown",
    name: "Downtown Garage",
    capacity: 220,
    position: [37.7765, -122.4172] as [number, number],
  },
  {
    id: "market",
    name: "Market Street Lot",
    capacity: 90,
    position: [37.7722, -122.421] as [number, number],
  },
  {
    id: "harbor",
    name: "Harbor Deck",
    capacity: 140,
    position: [37.7713, -122.4143] as [number, number],
  },
];

const markerIcon = new L.Icon({
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url).href,
  iconRetinaUrl: new URL(
    "leaflet/dist/images/marker-icon-2x.png",
    import.meta.url,
  ).href,
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url)
    .href,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function ParkingMapPage() {
  const markers = useMemo(() => lots, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Parking Map</h1>
        <p className="text-sm text-muted-foreground">
          Monitor live occupancy by location.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Active locations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[520px] w-full overflow-hidden rounded-lg">
            <MapContainer center={center} zoom={14} className="h-full w-full">
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {markers.map((lot) => (
                <Marker key={lot.id} position={lot.position} icon={markerIcon}>
                  <Popup>
                    <div className="text-sm">
                      <p className="font-semibold">{lot.name}</p>
                      <p>Capacity: {lot.capacity}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
