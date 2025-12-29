import { Search } from 'lucide-react'
import {Input} from '../../../components/ui/input.jsx'
import TabsListClient from './TablistHeaderClient.jsx'
import CreateFournisseurModal from '../../modals/client/CreateFournisseurModal.jsx'
import { useFetchClientFourCount } from '../../../api/queries/fournisseurs/useFetchCountClientFour.js'

const ClientHeader = ({ globalFilter, setGlobalFilter , selected ,setSelected}) => {

  // get cached query
  const {data: fournisseursClientCount} = useFetchClientFourCount();
  return (
    <div className='grid grid-cols-[repeat(5,1fr)] w-full h-full gap-x-4'>
        <div className='h-full flex items-center justify-start gap-4 cols-start-1 col-span-2'>
          <CreateFournisseurModal  selected={selected} setSelected={setSelected} /> 
        </div>
        
        <div className='col-start-3  col-span-2 h-full '>
            <TabsListClient selected={selected} setSelected={setSelected} fournisseursClientCount={fournisseursClientCount} />
        </div>

        <div className='relative w-full  max-w-[272px] desktop:max-w-full h-full'>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Rechercher...' className='w-full px-10 h-full' />              
        </div>
    </div>
  )
}

export default ClientHeader