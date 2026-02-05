import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiBookingsList } from "@/api/generated/api/api";
import { BookingStatusEnum } from "@/api/generated/schemas/bookingStatusEnum";

type BookingRow = {
  id: string;
  driver: string;
  spot: string;
  status: BookingStatusEnum;
  start: string;
  duration: string;
};

type Filters = {
  query: string;
  status: "all" | BookingStatusEnum;
};

const tableHeaders = [
  "Booking ID",
  "Driver",
  "Spot",
  "Status",
  "Start",
  "Duration",
];

const statusOptions: Array<{
  label: string;
  value: BookingStatusEnum | "all";
}> = [
  { label: "All", value: "all" },
  { label: "Pending", value: BookingStatusEnum.PENDING },
  { label: "Confirmed", value: BookingStatusEnum.CONFIRMED },
  { label: "Active", value: BookingStatusEnum.ACTIVE },
  { label: "Completed", value: BookingStatusEnum.COMPLETED },
  { label: "Cancelled", value: BookingStatusEnum.CANCELLED },
  { label: "No show", value: BookingStatusEnum.NO_SHOW },
];

const formatDateTime = (value: unknown) => {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    return "—";
  }
  return date.toLocaleString();
};

export function BookingsPage() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    status: "all",
  });
  const [draftFilters, setDraftFilters] = useState<Filters>({
    query: "",
    status: "all",
  });

  const bookingsQuery = useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => apiBookingsList(),
    staleTime: 30_000,
  });

  const data = useMemo(() => {
    const rows: BookingRow[] =
      bookingsQuery.data?.data?.results.map((booking) => ({
        id: booking.ticket_number ?? booking.id,
        driver: booking.user_email ?? booking.user,
        spot: booking.spot_number ?? booking.spot,
        status: booking.status ?? BookingStatusEnum.PENDING,
        start: formatDateTime(booking.entry_time),
        duration: `${booking.duration}m`,
      })) ?? [];

    return rows.filter((row) => {
      const matchesQuery =
        filters.query.length === 0 ||
        row.driver.toLowerCase().includes(filters.query.toLowerCase()) ||
        row.id.toLowerCase().includes(filters.query.toLowerCase());
      const matchesStatus =
        filters.status === "all" || row.status === filters.status;
      return matchesQuery && matchesStatus;
    });
  }, [bookingsQuery.data, filters]);

  const rows = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Review recent booking sessions and filter by status.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-4 md:flex-row md:items-end"
            onSubmit={(event) => {
              event.preventDefault();
              setFilters(draftFilters);
            }}
          >
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by driver or booking ID"
                value={draftFilters.query}
                onChange={(event) =>
                  setDraftFilters((previous) => ({
                    ...previous,
                    query: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                value={draftFilters.status}
                onChange={(event) =>
                  setDraftFilters((previous) => ({
                    ...previous,
                    status: event.target.value as Filters["status"],
                  }))
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit">Apply</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-[420px] overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tableHeaders.length}>
                      {bookingsQuery.isLoading
                        ? "Loading bookings..."
                        : "No bookings found."}
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.driver}</TableCell>
                      <TableCell>{row.spot}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.start}</TableCell>
                      <TableCell>{row.duration}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
