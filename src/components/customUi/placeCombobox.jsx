"use client"
import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { placesWithGroups } from "../../utils/states"

export function ComboboxPlace({title , field }) {
  const [open, setOpen] = React.useState(false)

  // Get current value from form field
  const currentValue = field?.value || ""

  // Find the display label for the current value
  const getDisplayLabel = (value) => {
    if (!value) return null
    // eslint-disable-next-line no-unused-vars
    for (const [groupName, places] of Object.entries(placesWithGroups)) {
      const found = places.find(place => place === value)
      if (found) return found
    }
    return null
  }

  const handleSelect = (selectedValue) => {
    const newValue = selectedValue === currentValue ? "" : selectedValue
    // Update form field
    field?.onChange(newValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
                        "w-full truncate  justify-between",
                        !field.value && "text-muted-foreground font-normal"
                      )}
        >
          <span className="truncate ">
            {getDisplayLabel(currentValue) || title}
          </span>
          <ChevronsUpDown className="opacity-50 shrink-0 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent avoidCollisions={true} collisionPadding={{ right: 16, top: 16, bottom: 16, left: 16 }} className="w-[500px] p-0">
        <Command>
          <CommandInput placeholder={"Rechercher un lieu..."} className="h-9" />
          <CommandList>
            <CommandEmpty>Aucun lieu trouvé.</CommandEmpty>
            {Object.entries(placesWithGroups).map(([groupName, places]) => (
              <CommandGroup key={groupName} heading={groupName}>
                {places.map((place) => (
                  <CommandItem
                    key={place}
                    value={place}
                    onSelect={handleSelect}
                  >
                    {place}
                    <Check
                      className={cn(
                        "ml-auto",
                        currentValue === place ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}