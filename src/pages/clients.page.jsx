import ClientsContent from "../components/rod/client/ClientContent";
import FournisseurContent from "../components/rod/client/FournisseurContent";
import ClientHeader from '../components/rod/client/ClientHeader'
import {  useState } from 'react'



const ClientsPage = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [selected , setSelected] = useState(0);
  
    const renderSelected = () => {
      switch (selected) {
        case 0 : 
          return <FournisseurContent globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />;
        case 1 :
          return <ClientsContent globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />;

      }
    }
  return (
    <div className="w-full h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8">
      <ClientHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selected={selected}
        setSelected={setSelected}
      />
      {renderSelected()}
    </div>
  )
}

export default ClientsPage