"use client"


import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [month, setMonth] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    if (value) {
      setInputValue(format(value, "MMMM dd, yyyy"))
      setMonth(value)
    } else {
      setInputValue("")
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    const date = new Date(e.target.value)
    if (!isNaN(date.getTime())) {
      onChange?.(date)
      setMonth(date)
    } else if (e.target.value === "") {
      onChange?.(undefined)
    }
  }

  return (
    <div className="relative group w-full" data-state={open ? "open" : undefined}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <CalendarIcon className={cn("h-4 w-4 transition-colors", open ? "text-ring" : "text-muted-foreground group-focus-within:text-ring")} />
      </div>
      <Input
        value={inputValue}
        placeholder={placeholder}
        className={cn("pl-9 pr-10 transition-colors", "group-has-[[data-state=open]]:border-ring", "group-focus-within:border-ring", className)}
        onChange={handleInputChange}
        disabled={disabled}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent hover:text-foreground"
            disabled={disabled}
          >
            <CalendarIcon className="h-4 w-4 opacity-0" /> {/* Hidden spacer or actual trigger? Let's use chevron if available or just transparent overlay */}
            <span className="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
