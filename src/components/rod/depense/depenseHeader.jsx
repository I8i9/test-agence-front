import {Input} from '../../../components/ui/input.jsx'
import {  Search } from 'lucide-react';
import TabsListDepense from './TablistHeaderDepense.jsx';
import CreateDepenseModal from '../../modals/depense/CreateDepenseModal/CreateDepenseModal.jsx';
import CreateRappelModal from '../../modals/depense/CreateRappelModal/CreateRappelModal.jsx';
import { useFetchDepenseCount } from '../../../api/queries/depense/useFetchCountDepense.js';

const DepenseHeader = ({globalFilter , setGlobalFilter , selected ,setSelected}) => {

   // get cached query
  const {data: depenseCount} = useFetchDepenseCount();

  return (
    <div className='grid grid-cols-[repeat(5,1fr)] w-full h-full gap-x-4'>
        <div className='h-full flex items-center justify-start gap-4 cols-start-1 col-span-2'>
          <CreateDepenseModal  selected={selected} setSelected={setSelected} />
          { // to be removed later
          //<CreateRappelModal  selected={selected} setSelected={setSelected} />
          }
        </div>
        
        <div className='col-start-3  col-span-2 h-full '>
            {/*<TabsListDepense selected={selected} setSelected={setSelected} depenseCount={depenseCount} />*/}
        </div>

        <div className='relative w-full  max-w-[272px] desktop:max-w-full h-full'>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input value={globalFilter} onChange={(e)=>setGlobalFilter(e.target.value)} placeholder='Rechercher...' className='w-full px-10 h-full' />              
        </div>
    </div>
  )
}

export default DepenseHeader