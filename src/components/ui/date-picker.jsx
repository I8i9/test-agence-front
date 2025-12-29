import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Function to format date as "EEEE, dd MMMM, yyyy" with capitalized first letters

const FormatDateEEEEddMMyyyy = (date) => {
  const formatted = format(new Date(date), "EEEE, dd MMMM, yyyy", { locale: fr });
  
  // Find the position of the month (after the comma and space and day number)
  const commaIndex = formatted.indexOf(',');
  const monthStartIndex = formatted.indexOf(' ', commaIndex + 2) + 1; // Find space after day number
  
  return formatted[0].toUpperCase() + 
         formatted.slice(1, monthStartIndex) + 
         formatted[monthStartIndex].toUpperCase() + 
         formatted.slice(monthStartIndex + 1);
}



export function DatePicker({ date, setDate, title, disabled = false , disabledButton = false , className ,alwaysButtom = false}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    disabled={disabledButton}
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon  />
                    {date ? <span className="mt-0.5">{ FormatDateEEEEddMMyyyy(date) }</span> : <span >{title || "Choisir une date"}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent side={alwaysButtom ? "bottom" : undefined} avoidCollisions={true} collisionPadding={4} align="start" className="w-full p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                        // Prevent deselecting the date (i.e., clicking again to remove)
                        if (!selectedDate) return
                        setDate(selectedDate)
                    }}
                    initialFocus
                    captionLayout="dropdown"
                    disabled={disabled}
                    defaultMonth={ date || new Date()}
                    toYear={2045}
                    
                />
            </PopoverContent>
        </Popover>
    )
}
