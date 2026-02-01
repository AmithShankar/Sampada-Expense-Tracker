import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore } from "@/contexts/AuthContext";
import { getAllExpensesApi } from "../api/api";
import { useQuery } from "@tanstack/react-query";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { columns } from "./components/columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { ExpenseTableProps, PagingState } from "@/types/expensesTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Field, FieldLabel } from "../ui/field";

export const usePagingStore = create<PagingState>()(
  persist(
    (set) => ({
      pagingData: {
        pageIndex: 0,
        pageSize: 10,
        totalElements: 0,
        totalPages: 0,
      },

      setPagingApiData: (data) =>
        set((state) => ({
          pagingData: data
            ? {
                pageIndex: data.page,
                pageSize: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages,
              }
            : state.pagingData,
        })),

      setPagingData: (pagingData) => set({ pagingData }),
    }),
    {
      name: "paging-storage",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export function ExpenseTable({
  filters,
  rowData,
  setShowAddExpense,
  setIsEmpty,
}: ExpenseTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const pagingData = usePagingStore((state) => state.pagingData);
  const setPagingData = usePagingStore((state) => state.setPagingData);
  const setPagingApiData = usePagingStore((state) => state.setPagingApiData);

  type ActionState =
    | { type: "edit"; row: any }
    | { type: "delete"; row: any }
    | null;
  const [action, setAction] = useState<ActionState>(null);

  useEffect(() => {
    if (!filters) return;

    const newColumnFilters = [];

    // Category Filter
    if (filters.category && filters.category !== "all") {
      newColumnFilters.push({ id: "category_name", value: filters.category });
    }

    // Date Range Filter
    if (filters.dateFrom || filters.dateTo) {
      newColumnFilters.push({
        id: "date",
        value: { from: filters.dateFrom, to: filters.dateTo },
      });
    }

    // Amount Range Filter
    if (filters.minAmount || filters.maxAmount) {
      newColumnFilters.push({
        id: "amount",
        value: {
          min: filters.minAmount,
          max: filters.maxAmount,
        },
      });
    }

    setColumnFilters(newColumnFilters);
  }, [filters]);

  useEffect(() => {
    const { type, row } = action ?? { type: null, row: null };
    if (type == "edit" && row) {
      rowData({
        isUpdate: true,
        rowData: [row],
        type,
      });
      setShowAddExpense(true);
    } else if (type == "delete" && row) {
      rowData({
        isUpdate: false,
        rowData: [row],
        type,
      });
      setShowAddExpense(true);
    }
  }, [action]);

  const userId = useAuthStore.getState().userId;

  const { data, isLoading } = useQuery({
    queryKey: [
      "allExpenses",
      userId,
      pagingData?.pageIndex,
      pagingData?.pageSize,
    ],
    queryFn: () =>
      getAllExpensesApi({
        userId,
        page: pagingData?.pageIndex,
        size: pagingData?.pageSize,
      }),
  });

  useEffect(() => {
    if (data?.data?.length === 0) {
      setIsEmpty(true);
      return;
    }
    setPagingApiData(data?.paging);
  }, [data]);

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: pagingData?.pageIndex,
        pageSize: pagingData?.pageSize,
      },
    },
    meta: {
      onEdit: (row: any) => setAction({ type: "edit", row }),
      onDelete: (row: any) => setAction({ type: "delete", row }),
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({
              pageIndex: pagingData?.pageIndex,
              pageSize: pagingData?.pageSize,
            })
          : updater;

      setPagingData({
        ...pagingData,
        pageIndex: next.pageIndex,
        pageSize: next.pageSize,
      });
    },
    manualPagination: true,
    pageCount: pagingData?.totalPages ?? 0,
  });

  return (
    <div className="space-y-4">
      <div className="chart-container overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className="table-row-hover animate-fade-in opacity-0"
                  style={{ animationDelay: `${index * 0.05}s`, opacity: 1 }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between sm:space-x-6 lg:space-x-8">
        <div className="flex items-center justify-between gap-4">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page">
              Expenses per page
            </FieldLabel>
            <Select
              value={String(pagingData?.pageSize ?? 10)}
              onValueChange={(value) => {
                setPagingData({
                  ...pagingData,
                  pageSize: Number(value),
                  pageIndex: 0,
                });
              }}
            >
              <SelectTrigger className="h-8 w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={pageSize.toString()}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <div>Total Expenses: {pagingData?.totalElements ?? 0}</div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagingData?.pageIndex > 0)
                      setPagingData({
                        ...pagingData,
                        pageIndex: pagingData?.pageIndex - 1,
                      });
                  }}
                />
              </PaginationItem>

              {Array.from({ length: pagingData?.totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={pagingData?.pageIndex === i}
                    onClick={(e) => {
                      e.preventDefault();
                      setPagingData({
                        ...pagingData,
                        pageIndex: i,
                      });
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagingData?.pageIndex < pagingData?.totalPages - 1)
                      setPagingData({
                        ...pagingData,
                        pageIndex: pagingData?.pageIndex + 1,
                      });
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
