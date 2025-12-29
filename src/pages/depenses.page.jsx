import {  useState } from 'react'
import DepenseHeader from '../components/rod/depense/depenseHeader';
import ReminderContent from '../components/rod/depense/rappel/reminderContent';
import RappelContent from '../components/rod/depense/rappel/rappelContent';
import DepenseContent from '../components/rod/depense/depenseContent';





const DemandesPage = () => {

  const [globalFilter, setGlobalFilter] = useState('');
  const [selected , setSelected] = useState(0);

  const renderSelected = () => {
    switch (selected) {
      case 0 :
        return <DepenseContent globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />;
    }
  }

  return (
    <div className="w-full  h-full grid grid-rows-[40px_1fr_32px] desktop-xl:grid-rows-[48px_1fr_32px] gap-y-4 desktop-lg:gap-y-6 desktop-xl:gap-y-8">
      <DepenseHeader
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        selected={selected}
        setSelected={setSelected}
      />
      {renderSelected()}
    </div>
  )
}

export default DemandesPage