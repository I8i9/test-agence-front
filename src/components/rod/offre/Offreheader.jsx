import {Input} from '../../../components/ui/input.jsx'
import {  Search } from 'lucide-react';
import CreateOffreModal from '../../../components/modals/offre/CreateOffreModal/CreateOffreModal.jsx'
import TabsListOffre from './TabListHeader.jsx';
import { Button } from '../../../components/ui/button.jsx';
import { PlusSquare } from 'lucide-react';
import { useState } from 'react';


const OffreHeader=({table,setGlobalFilter,globalFilter})=>{
    const [offreOpen, setOffreOpen] = useState(false);
    
    return(
            <div className='grid grid-cols-[repeat(5,1fr)]  desktop-lg:grid-cols-[repeat(5,1fr)] w-full h-full gap-x-4'>
            <div className='h-full desktop-lg:cols-start-1 desktop-lg:col-span-2'>
                <Button onClick={() => setOffreOpen(true)} className='flex items-center leading-none gap-2 h-full'>
                    <PlusSquare/> 
                    Publier offre
                </Button>
            </div>
            
            <div className='desktop-lg:col-start-3 col-start-3 col-span-2 h-full '>
                <TabsListOffre table={table} />
            </div>

            <div className='relative w-full  max-w-[272px] desktop:max-w-full h-full'>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Rechercher...' className='w-full px-10 h-full' />              
            </div>

            {offreOpen && <CreateOffreModal open={offreOpen} close={() => setOffreOpen(false)} startingStep={0} />}
        </div>
    )
}
export default OffreHeader