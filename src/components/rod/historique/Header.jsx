import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ActionsCombobox from './ActionsCombobox';
import TypesCombobox from './TypesCombobox';
import { DatePickerWithRange } from '../../ui/date-range';

export default function Header({
  globalFilter, setGlobalFilter,
  date , setDate,
  selectedAction, setSelectedAction,
  selectedType, setSelectedType
})

{
  return (
    <div className="w-full h-full">
        <div className="flex items-center justify-between gap-4 h-full"> 
            
        <div className='flex items-center gap-4 h-full'>
            {/* Date Range Pickers */} 
            <DatePickerWithRange
                date={date}
                setDate={setDate} 
            />
               
        
        {/* Actions and Types Comboboxes */} 
            
            <TypesCombobox 
                value={selectedType} 
                onChange={setSelectedType}
                    className = " h-full"
             /> 
             <ActionsCombobox 
                value={selectedAction} 
                onChange={setSelectedAction}
                className = " h-full"
             />
          </div>

             {/* Search Input */}
            <div className="relative h-full flex-1 max-w-[272px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 " size={16} />
                <Input
                type="text"
                placeholder="Rechercher..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 w-full h-full  rounded-sm"
                />
            </div>
        </div>
    </div>
  )
} 