import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import { PlusSquare, Search, TriangleAlert } from 'lucide-react';
import TabsListGarage from './tabsList';
import { useState } from 'react';
import AddCarGarage from '../../modals/garage/addCar/AddCarForm';
import ToolTipCustom from '../../customUi/tooltip';


const GarageHeader=({setGlobalFilter,globalFilter,table})=>{
    const [isAlert ,setIsAlert] = useState(true)
    const handleClick = () => {
        
        if(isAlert){
            table.setColumnFilters([ ...table.getState().columnFilters, { id: 'hasProblem', value: true }]);
        }
        if(!isAlert){
            table.setColumnFilters(
                table.getState().columnFilters.filter(f => f.id !== 'hasProblem')
            );
        }
        setIsAlert(!isAlert);
    }
    return(
        <div className='h-full w-full  flex justify-between items-center '>
            <div className='h-full'>
                <AddCarGarage />
            </div>
            <div className='flex gap-4 desktop-lg:gao-6 h-full'>
            <div className=' h-full '>
                <TabsListGarage table={table} />
            </div>

            <div className='relative w-full max-w-[272px] desktop:max-w-full h-full'>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input placeholder='Rechercher...' value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className='w-full px-10 h-full' />
                <button className={`absolute  cursor-pointer transition-colors duration-200 top-1/2 right-3 -translate-y-1/2 ${!isAlert ? 'text-amber-500' : 'text-gray-500'}`} onClick={handleClick} >
                    <ToolTipCustom 
                    trigger = {
                        <TriangleAlert  className='h-5 w-5 shrink-0' />
                    }
                    message = {isAlert ? 'Afficher les véhicules avec problèmes' : 'Afficher tous les véhicules'}
                />
                </button>               
            </div>
            </div>
        </div>
    )
}
export default GarageHeader