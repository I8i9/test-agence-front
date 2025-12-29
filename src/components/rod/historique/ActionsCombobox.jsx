import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const actionsOptions = [
  { value: 'all', label: 'Toutes Actions' },
  { value: 'Ajout', label: 'Ajout' },
  { value: 'Mise à jour', label: 'Mise à jour' },
  { value: 'Suppression', label: 'Suppression' },
  { value: 'Confirmation', label: 'Confirmation' },
  { value: 'Annulation', label: 'Annulation' },
  { value: 'Refus', label: 'Refus' },
  { value: 'Paiement', label: 'Paiement' },


];

const ActionsCombobox = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selectedOption = actionsOptions.find((action) => action.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-40 h-full justify-between rounded-sm"
        >
          {selectedOption?.label || "Toutes Actions"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent avoidCollisions={true} collisionPadding={{ right: 16, top: 16, bottom: 16, left: 16 }} className="p-0">
        <Command>
          <CommandInput placeholder="Rechercher..." />
          <CommandList>
            <CommandEmpty>Aucune action trouvée.</CommandEmpty>
            <CommandGroup>
              {actionsOptions.map((action) => (
                <CommandItem
                  key={action.value}
                  value={action.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {action.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-gray-700",
                      value === action.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ActionsCombobox;