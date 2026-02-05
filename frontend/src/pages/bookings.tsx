import { useMemo, useRef, useState, type ReactNode } from "react";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import {
  createColumnHelper,
  type CellContext,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualItem } from "@tanstack/react-virtual";

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

type BookingRow = {
  id: string;
  driver: string;
  spot: string;
  status: "active" | "completed" | "overdue";
  start: string;
  duration: string;
};

type Filters = {
  query: string;
  status: "all" | BookingRow["status"];
};

type HeaderGroupShape = {
  id: string;
  headers: Array<{
    id: string;
    isPlaceholder: boolean;
    column: {
      columnDef: {
        header?: ReactNode;
      };
    };
  }>;
};

type RowShape = {
  id: string;
  getVisibleCells: () => Array<{
    id: string;
    getValue: () => unknown;
  }>;
};

const columnHelper = createColumnHelper<BookingRow>();

const columns = [
  columnHelper.accessor("id", {
    header: "Booking ID",
    cell: (info: CellContext<BookingRow, string>) => info.getValue(),
  }),
  columnHelper.accessor("driver", {
    header: "Driver",
    cell: (info: CellContext<BookingRow, string>) => info.getValue(),
  }),
  columnHelper.accessor("spot", {
    header: "Spot",
    cell: (info: CellContext<BookingRow, string>) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info: CellContext<BookingRow, BookingRow["status"]>) =>
      info.getValue(),
  }),
  columnHelper.accessor("start", {
    header: "Start",
    cell: (info: CellContext<BookingRow, string>) => info.getValue(),
  }),
  columnHelper.accessor("duration", {
    header: "Duration",
    cell: (info: CellContext<BookingRow, string>) => info.getValue(),
  }),
];

const baseData: BookingRow[] = Array.from({ length: 120 }).map((_, index) => ({
  id: `BK-${1000 + index}`,
  driver: index % 2 === 0 ? "Avery Park" : "Jordan Lane",
  spot: `L-${(index % 18) + 1}`,
  status:
    index % 3 === 0 ? "overdue" : index % 2 === 0 ? "active" : "completed",
  start: `Feb 05, 2026 · ${8 + (index % 8)}:00`,
  duration: `${45 + (index % 5) * 15}m`,
}));

export function BookingsPage() {
  const [filters, setFilters] = useState<Filters>({
    query: "",
    status: "all",
  });

  const form = useForm<Filters>({
    defaultValues: filters,
    onSubmit: async ({ value }: { value: Filters }) => {
      setFilters(value);
    },
  });

  const data = useMemo(() => {
    return baseData.filter((row) => {
      const matchesQuery =
        filters.query.length === 0 ||
        row.driver.toLowerCase().includes(filters.query.toLowerCase()) ||
        row.id.toLowerCase().includes(filters.query.toLowerCase());
      const matchesStatus =
        filters.status === "all" || row.status === filters.status;
      return matchesQuery && matchesStatus;
    });
  }, [filters]);

  const table = useReactTable<BookingRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const parentRef = useRef<HTMLDivElement>(null);
  const rows = table.getRowModel().rows as RowShape[];
  const headerGroups = table.getHeaderGroups() as HeaderGroupShape[];

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 8,
  });

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
              void form.handleSubmit();
            }}
          >
            <form.Field
              name="query"
              children={(field: FieldApi<Filters, "query">) => (
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <Input
                    placeholder="Search by driver or booking ID"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </div>
              )}
            />
            <form.Field
              name="status"
              children={(field: FieldApi<Filters, "status">) => (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                    value={field.state.value}
                    onChange={(event) => field.handleChange(event.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
              )}
            />
            <Button type="submit">Apply</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={parentRef}
            className="max-h-[420px] overflow-auto rounded-md border"
          >
            <Table>
              <TableHeader>
                {headerGroups.map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : header.column.columnDef.header}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody
                style={{
                  height: rowVirtualizer.getTotalSize(),
                  position: "relative",
                }}
              >
                {rowVirtualizer
                  .getVirtualItems()
                  .map((virtualRow: VirtualItem) => {
                    const row = rows[virtualRow.index];
                    return (
                      <TableRow
                        key={row.id}
                        style={{
                          position: "absolute",
                          top: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          width: "100%",
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.getValue() as string}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
