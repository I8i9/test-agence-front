import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const typesOptions = [
  { value: 'all', label: 'Tous Objets' },
  { value: 'Agence', label: 'Agence' },
  { value: 'Voiture', label: 'Voiture' },
  { value: 'Offre', label: 'Offre' },
  { value: 'Promo', label: 'Promo' },
  { value: 'Contrat', label: 'Contrat' },
  { value: 'Login', label: 'Comptes' },
  { value: 'Depense', label: 'Dépense' }, // Fixed from 'Depense' to 'Dépense'
  { value: 'Fournisseur', label: 'Fournisseur' },
  { value: 'Paiement_Depense', label: 'Paiement Dépense' },
  { value: 'Paiement_Contrat', label: 'Paiement Contrat' },
];

const TypesCombobox = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const selectedOption = typesOptions.find((type) => type.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="min-w-40 w-48 h-full justify-between rounded-sm"
        >
          {selectedOption?.label || "Tous Objets"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent avoidCollisions={true} collisionPadding={{ right: 16, top: 16, bottom: 16, left: 16 }} className="p-0">
        <Command>
          <CommandInput placeholder="Rechercher type..." className="h-9" />
          <CommandList>
            <CommandEmpty>Aucun objet trouvé.</CommandEmpty>
            <CommandGroup>
              {typesOptions.map((type) => (
                <CommandItem
                  key={type.value}
                  value={type.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {type.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === type.value ? "opacity-100" : "opacity-0"
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

export default TypesCombobox;