"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MONTHS = [
  { label: "January", short: "Jan", value: "01", raw: 1 },
  { label: "February", short: "Feb", value: "02", raw: 2 },
  { label: "March", short: "Mar", value: "03", raw: 3 },
  { label: "April", short: "Apr", value: "04", raw: 4 },
  { label: "May", short: "May", value: "05", raw: 5 },
  { label: "June", short: "Jun", value: "06", raw: 6 },
  { label: "July", short: "Jul", value: "07", raw: 7 },
  { label: "August", short: "Aug", value: "08", raw: 8 },
  { label: "September", short: "Sep", value: "09", raw: 9 },
  { label: "October", short: "Oct", value: "10", raw: 10 },
  { label: "November", short: "Nov", value: "11", raw: 11 },
  { label: "December", short: "Dec", value: "12", raw: 12 },
];

type MonthYearFormat =
  | "yyyy-MM"
  | "MM-yyyy"
  | "MMMM yyyy"
  | "MMM yyyy"
  | string;

type MonthYearSelectProps = {
  value?: string;
  onChange?: (value: string) => void;
  format?: MonthYearFormat;
  fromYear?: number;
  toYear?: number;
  disabled?: boolean;
};

export function MonthYearSelect({
  value,
  onChange,
  format = "yyyy-MM",
  fromYear = new Date().getFullYear() - 10,
  toYear = new Date().getFullYear() + 10,
  disabled = false,
}: MonthYearSelectProps) {
  const today = new Date();
  const defaultMonth = String(today.getMonth() + 1).padStart(2, "0");
  const defaultYear = String(today.getFullYear());

  const [month, setMonth] = React.useState<string>(defaultMonth);
  const [year, setYear] = React.useState<string>(defaultYear);

  React.useEffect(() => {
    if (!value) {
      const defaultVal = formatValue(defaultYear, defaultMonth);
      setMonth(defaultMonth);
      setYear(defaultYear);
      onChange?.(defaultVal);
    }
  }, []);

  // Update month/year when parent value changes
  React.useEffect(() => {
    if (!value) {
      setMonth(defaultMonth);
      setYear(defaultYear);
      return;
    }

    let y = "";
    let m = "";

    if (format === "yyyy-MM") {
      [y, m] = value.split("-");
    } else if (format === "MM-yyyy") {
      [m, y] = value.split("-");
    } else if (format === "MMMM yyyy" || format === "MMM yyyy") {
      const parts = value.split(" ");
      const monthLabel = parts[0];
      const monthObj = MONTHS.find(
        (mo) => mo.label === monthLabel || mo.short === monthLabel,
      );
      if (monthObj) m = monthObj.value;
      y = parts[1];
    }

    if (y && m) {
      setYear(y);
      setMonth(m.padStart(2, "0"));
    }
  }, [value, format, defaultMonth, defaultYear]);

  const formatValue = (y: string, m: string) => {
    const monthData = MONTHS[Number(m) - 1];

    return format
      .replace("yyyy", y)
      .replace("MMMM", monthData.label)
      .replace("MMM", monthData.short)
      .replace("MM", m)
      .replace("M", String(monthData.raw));
  };

  const emitChange = (m: string, y: string) => {
    if (!m || !y) return;
    onChange?.(formatValue(y, m));
  };

  return (
    <div className="flex gap-2">
      <Select
        value={month}
        onValueChange={(m) => {
          setMonth(m);
          emitChange(m, year);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {MONTHS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={year}
        onValueChange={(y) => {
          setYear(y);
          emitChange(month, y);
        }}
        disabled={disabled}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(
            { length: toYear - fromYear + 1 },
            (_, i) => fromYear + i,
          ).map((y) => (
            <SelectItem key={y} value={String(y)}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
