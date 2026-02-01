"use client";

import { type DateRange } from "react-day-picker";
import { Calendar } from "@/components/ui/calendar";

interface Calendar04Props {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export default function Calendar04({ date, setDate }: Calendar04Props) {
  return (
    <Calendar
      mode="range"
      defaultMonth={date?.from}
      selected={date}
      onSelect={setDate}
      numberOfMonths={1} // Use 1 for small filter sidebars, 2 for large popovers
      className="rounded-lg border shadow-sm"
    />
  );
}
