"use client";

import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { DateRange } from "@/lib/types/search";
import type { DateRange as ReactDayPickerDateRange} from "react-day-picker";

interface DateRangePickerProps {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
}

export default function DateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateRange = (dateRange: DateRange) => {
    if (!dateRange.from) return "Select dates";
    if (!dateRange.to) return format(dateRange.from, "MMM dd");

    const nights = Math.ceil(
      (dateRange.to.getTime() - dateRange.from.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    return `${format(dateRange.from, "MMM dd")} - ${format(
      dateRange.to,
      "MMM dd"
    )} (${nights} ${nights === 1 ? "night" : "nights"})`;
  };

  const handleDateSelect = (
    range: ReactDayPickerDateRange | undefined
  ) => {
    if (!range) return;

    const { from, to } = range;
    let adjustedTo = to;

    if (from && to && from >= to) {
      adjustedTo = addDays(from, 1);
    }
    if (!from || !adjustedTo) return;

    onChange({ from, to: adjustedTo });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          className="w-full justify-start text-left font-normal h-12 px-3"
          variant={"outline"}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="flex-1 truncate">{formatDateRange(value)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          autoFocus
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={handleDateSelect}
          numberOfMonths={1}
          disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
          className="rounded-md"
        />
      </PopoverContent>
    </Popover>
  );
}
