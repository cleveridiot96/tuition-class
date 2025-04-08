
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  selected?: Date | null;
  onSelect?: (date: Date | null) => void;
  className?: string;
  id?: string;
}

export function DatePicker({
  date,
  setDate,
  selected,
  onSelect,
  className,
  id
}: DatePickerProps) {
  const selectedDate = date || selected;
  const handleDateChange = setDate || onSelect;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleDateChange as any}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
