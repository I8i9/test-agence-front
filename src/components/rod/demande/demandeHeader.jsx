import {Input} from '../../../components/ui/input.jsx'
import {  Search } from 'lucide-react';
import TabsListDemande from './TablistHeader.jsx';
import HeaderSwitch from './headerSwitch.jsx';
import { useState } from 'react';


const DemandeHeader=({table,setGlobalFilter,globalFilter})=>{
    const [isChecked, setIsChecked] = useState(false);
    const [disabled, setDisabled] = useState(false);

    return(
            <div className='grid grid-cols-[repeat(5,1fr)] w-full h-full gap-x-4'>
            <div className='h-full flex items-center justify-start col-start-1 col-span-2'>
                
            </div>
            
            <div className='col-start-3 col-span-2 h-full '>
                <TabsListDemande  table={table} removeUnread={() => setIsChecked(false)} setDisabled={setDisabled} />
            </div>

            <div className='relative w-full  max-w-[272px] desktop:max-w-full h-full'>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Rechercher...' className='w-full px-10 h-full' />
                <HeaderSwitch table={table} isChecked={isChecked} setIsChecked={setIsChecked} disabled={disabled} />
            </div>
        </div>
    )
}
export default DemandeHeader