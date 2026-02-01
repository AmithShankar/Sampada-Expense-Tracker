import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/contexts/AuthContext";
import { budgetIcons } from "@/data/data";
import { cn } from "@/lib/utils";
import { ExpensesTable } from "@/types/expensesTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit2,
  MoreHorizontal,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { useMemo } from "react";

export const ccy = () => {
  const currencyCode = useAuthStore((state) => state.currency);

  return useMemo(() => {
    const symbols: Record<string, string> = {
      INR: "₹",
      USD: "$",
      EUR: "€",
      GBP: "£",
    };
    return symbols[currencyCode] || "$";
  }, [currencyCode]);
};

const paymentMethodColors: Record<string, string> = {
  Card: "bg-chart-1/20 text-chart-1 border border-chart-1/30",
  UPI: "bg-chart-2/20 text-chart-2 border border-chart-2/30",
  Cash: "bg-chart-3/20 text-chart-3 border border-chart-3/30",
  Wallet: "bg-chart-4/20 text-chart-4 border border-chart-4/30",
};

export const columns: ColumnDef<ExpensesTable>[] = [
  {
    accessorKey: "category.name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold text-foreground hover:text-primary transition-colors"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original.category;
      const icon = budgetIcons[category?.categoryIcon] || "💰";
      return (
        <div className="flex items-center gap-3">
          <span className="text-xl filter drop-shadow-sm">{icon}</span>
          <div>
            <p className="font-semibold text-foreground">{category?.name}</p>
            {row.original.isRecurring && (
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-primary">
                <RefreshCw className="h-3 w-3" /> Recurring
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "notes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0  text-foreground hover:text-primary"
      >
        Notes <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-foreground text-sm">{row.original.notes}</span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-foreground font-medium">
        {new Date(row.original.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="p-0 font-bold text-foreground hover:text-primary"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-bold text-foreground text-lg">
        {ccy()}
        {row.original.amount.toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment",
    cell: ({ row }) => (
      <Badge
        variant="secondary"
        className={cn(
          "font-bold border",
          paymentMethodColors[row.original.paymentMethod],
        )}
      >
        {row.original.paymentMethod}
      </Badge>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => (
      <div className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem
              onClick={() => table.options.meta?.onEdit?.(row.original)}
            >
              <Edit2 className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive font-bold"
              onClick={() => table.options.meta?.onDelete?.(row.original)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
