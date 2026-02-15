import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Calendar04 from "../calendar-04";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "../api/api";
import { ExpenseFiltersProps, FilterState } from "@/types/expensesTable";

const paymentMethods = ["Cash", "Card", "UPI", "Wallet"];

export function ExpenseFilters({ onFilterChange }: ExpenseFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    paymentMethod: "",
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      category: "",
      paymentMethod: "",
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
    };
    setFilters(emptyFilters);
    onFilterChange?.(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== "");

  const userId = useAuthStore((state) => state.userId);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories", userId],
    queryFn: () => getCategoriesApi(userId),
    enabled: !!userId,
  });

  return (
    <div className="space-y-4">
      {/* Filter Toggle Buttons */}
      <div className="flex flex-wrap items-center gap-3 dark:text-primary">
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "gap-2 font-bold transition-all",
            showFilters
              ? "bg-primary text-primary-foreground shadow-glow"
              : "bg-card border-border text-foreground hover:bg-secondary",
          )}
        >
          <Filter
            className={cn(
              "h-4 w-4",
              showFilters ? "text-white" : "text-primary",
            )}
          />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-background text-xs font-bold border border-primary/20">
              {Object.values(filters).filter((v) => v !== "").length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-medium"
          >
            <X className="h-4 w-4" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filters Grid */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 p-4 sm:p-6 rounded-xl bg-card border border-border shadow-lg animate-scale-in">
          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Category
            </label>
            <Select
              value={filters.category}
              onValueChange={(v) => handleChange("category", v)}
            >
              <SelectTrigger className="w-full bg-background border-border text-foreground font-medium h-10">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="all" className="font-bold">
                  All categories
                </SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Payment</label>
            <Select
              value={filters.paymentMethod}
              onValueChange={(v) => handleChange("paymentMethod", v)}
            >
              <SelectTrigger className="w-full bg-background border-border text-foreground font-medium h-10">
                <SelectValue placeholder="All methods" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border text-foreground">
                <SelectItem value="all" className="font-bold">
                  All methods
                </SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2 sm:col-span-2 md:col-span-3 xl:col-span-2">
            <label className="text-sm font-bold text-foreground">
              Date Range
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-medium h-10 bg-background border-border",
                    !filters.dateFrom && "text-muted-foreground",
                    filters.dateFrom && "text-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.dateFrom ? (
                    filters.dateTo ? (
                      <>
                        {format(parseISO(filters.dateFrom), "MMM dd")} -{" "}
                        {format(parseISO(filters.dateTo), "MMM dd")}
                      </>
                    ) : (
                      format(parseISO(filters.dateFrom), "MMM dd, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 bg-card border-border"
                align="start"
              >
                <Calendar04
                  date={{
                    from: filters.dateFrom
                      ? parseISO(filters.dateFrom)
                      : undefined,
                    to: filters.dateTo ? parseISO(filters.dateTo) : undefined,
                  }}
                  setDate={(range: DateRange | undefined) => {
                    const newFilters = {
                      ...filters,
                      dateFrom: range?.from ? range.from.toISOString() : "",
                      dateTo: range?.to ? range.to.toISOString() : "",
                    };
                    setFilters(newFilters);
                    onFilterChange?.(newFilters);
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Min Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Min Amount
            </label>
            <Input
              type="number"
              placeholder="0"
              className="w-full bg-background border-border text-foreground font-medium h-10"
              value={filters.minAmount}
              onChange={(e) => handleChange("minAmount", e.target.value)}
            />
          </div>

          {/* Max Amount */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">
              Max Amount
            </label>
            <Input
              type="number"
              placeholder="10000"
              className="w-full bg-background border-border text-foreground font-medium h-10"
              value={filters.maxAmount}
              onChange={(e) => handleChange("maxAmount", e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
