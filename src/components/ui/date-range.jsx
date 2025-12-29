 
import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { fr } from "date-fns/locale"

 
export function DatePickerWithRange({
  className,
  date,  setDate,
}) {
    
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start h-full text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <span className="mt-0.75 font-medium">
                  {format(date.from, "dd MMM yyyy", { locale: fr })} -{" "}
                  {format(date.to, "dd MMM yyyy", { locale: fr })}
                </span>
              ) : (
                format(date.from, "dd MMM yyyy", { locale: fr })
              )
            ) : (
              <span className="mt-0.75">Choisir une date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          sideOffset={4}
          align="center"
          avoidCollisions={true}
          side="bottom"
          className="w-auto p-0"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
            locale={fr}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}