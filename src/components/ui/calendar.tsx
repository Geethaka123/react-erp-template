"use client"

import * as React from "react"
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from "date-fns"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = {
  mode?: "single" | "range" | "default" | "multiple"
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  month?: Date
  onMonthChange?: (date: Date) => void
  captionLayout?: string
  initialFocus?: boolean
} & Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect">

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  mode = "single",
  selected,
  onSelect,
  month: controlledMonth,
  onMonthChange,
  initialFocus,
  ...props
}: CalendarProps) {
  // State for internal month management if not controlled
  const [internalMonth, setInternalMonth] = React.useState<Date>(
    controlledMonth || selected || new Date()
  )

  const currentMonth = controlledMonth || internalMonth

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth)
    } else {
      setInternalMonth(newMonth)
    }
  }



  const handleMonthSelect = (monthStr: string) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(parseInt(monthStr))
    handleMonthChange(newMonth)
  }

  const handleYearSelect = (yearStr: string) => {
    const newMonth = new Date(currentMonth)
    newMonth.setFullYear(parseInt(yearStr))
    handleMonthChange(newMonth)
  }

  // Generate days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart) // Sunday start
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  })

  // Weekday headers
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  // ranges for dropdowns
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i)

  return (
    <div className={cn("p-4", className)} {...props}>
      {/* Header / Navigation */}
      <div className="flex items-center justify-between space-x-4 mb-4 relative">
        {/* Month/Year Selects */}
        <div className="flex-1 flex justify-center gap-1 items-center z-10 relative">
             <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthSelect}
             >
                <SelectTrigger className="w-[120px] h-8 bg-transparent border-none shadow-none focus:ring-0 focus:ring-offset-0 px-2 py-0 text-sm font-semibold hover:bg-accent/50 text-foreground transition-colors cursor-pointer">
                    <SelectValue>{months[currentMonth.getMonth()]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px]" align="center">
                    {months.map((m, i) => (
                        <SelectItem key={m} value={i.toString()}>{m}</SelectItem>
                    ))}
                </SelectContent>
             </Select>

             <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearSelect}
             >
                <SelectTrigger className="w-[80px] h-8 bg-transparent border-none shadow-none focus:ring-0 focus:ring-offset-0 px-2 py-0 text-sm font-semibold hover:bg-accent/50 text-foreground transition-colors cursor-pointer">
                    <SelectValue>{currentMonth.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[200px]" align="center">
                     {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                </SelectContent>
             </Select>
        </div>
        
        {/* Navigation Buttons */}
         <div className="space-x-1 flex items-center absolute left-1">
             {/* Left absolute handled by container relative? No, let's stick to standard flex first or absolute like before if desired. user wanted specific arrows. taking cues from previous css */}
         </div>
         {/* Replicating the Shadcn/DayPicker structure roughly but with better layout control */}

      </div>

      {/* Grid Table */}
      <div className="w-full">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-muted-foreground rounded-md w-9 h-9 font-normal text-[0.8rem] flex justify-center items-center m-auto"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-y-2">
          {days.map((day, idx) => {
            const isSelected = selected && isSameDay(day, selected)
            const isToday = isSameDay(day, new Date())
            const isOutside = !isSameMonth(day, currentMonth)

            if (isOutside && !showOutsideDays) return <div key={idx} />
            
            return (
              <div key={day.toString()} className="relative flex justify-center items-center m-auto">
                 <button
                    onClick={() => onSelect?.(day)}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md",
                        isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                        isToday && !isSelected && "bg-accent text-accent-foreground",
                        isOutside && "text-muted-foreground opacity-50 bg-transparent", 
                        !isOutside && !isSelected && "hover:bg-accent hover:text-accent-foreground"
                    )}
                    data-date={day.toISOString()}
                 >
                    {format(day, "d")}
                 </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
