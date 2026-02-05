import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";
import { AnalyticsPage } from "@/pages/analytics";
import { BookingsPage } from "@/pages/bookings";
import { DashboardPage } from "@/pages/dashboard";
import { ParkingMapPage } from "@/pages/parking-map";
import { PricingPage } from "@/pages/pricing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "map", element: <ParkingMapPage /> },
      { path: "bookings", element: <BookingsPage /> },
      { path: "pricing", element: <PricingPage /> },
      { path: "analytics", element: <AnalyticsPage /> },
    ],
  },
]);
