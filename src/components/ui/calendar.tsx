"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/utils/cn"
import { buttonVariants } from "@/components/ui/button-shadcn"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-serif italic text-[var(--luxury-green)]",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-gray-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-gray-400 rounded-md w-8 font-black text-[0.6rem] uppercase tracking-widest",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[var(--luxury-cream)]/20 [&:has([aria-selected].day-outside)]:bg-[var(--luxury-cream)]/10 [&:has([aria-selected].day-range-end)]:rounded-r-full",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-full [&:has(>.day-range-start)]:rounded-l-full first:[&:has([aria-selected])]:rounded-l-full last:[&:has([aria-selected])]:rounded-r-full"
            : "[&:has([aria-selected])]:rounded-full"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-8 w-8 p-0 font-bold aria-selected:opacity-100 rounded-full hover:bg-[var(--luxury-cream)] transition-colors"
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-[var(--luxury-green)] !text-white hover:bg-[var(--luxury-green)] hover:text-white focus:bg-[var(--luxury-green)] focus:text-white rounded-full",
        day_today: "bg-[var(--luxury-gold)]/10 text-[var(--luxury-gold)] ring-1 ring-[var(--luxury-gold)]/20",
        day_outside:
          "day-outside text-gray-300 aria-selected:bg-[var(--luxury-cream)]/10 aria-selected:text-gray-400",
        day_disabled: "text-gray-200 opacity-50",
        day_range_middle:
          "aria-selected:bg-[var(--luxury-cream)]/20 aria-selected:text-[var(--luxury-green)]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
