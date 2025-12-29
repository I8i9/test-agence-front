import React, { useEffect } from 'react'
import PerformanceHeader from '../components/rod/performance/header';
import Tablist from '../components/rod/archive/tablist';
import {Button} from '../components/ui/button';
import { Sparkles } from 'lucide-react';
import OperationsContent from '../components/rod/performance/operations/operationsContent';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react';
import FinanceContent from '../components/rod/performance/finance/FinanceContent';
import ClientsContent from '../components/rod/performance/clients/clientsOperations';
import { useStore } from '../store/store';




const PerformancePage = () => {

  const rangeInStore = useStore((state) => state.range);
  const setRangeInStore = useStore((state) => state.setRangeStore);
  const [range , setRange] = React.useState({
    type: rangeInStore?.type ,
    from : rangeInStore?.from,
    to : rangeInStore?.to,
  });  

  useEffect(() => {
    setRangeInStore(range);
  }, [range]);
    
  const [activeTab , setActiveTab] = React.useState("operations");
  return (
    <div className='h-full w-full flex flex-col '>
      
      {/* archive header */}
      <PerformanceHeader range={range} setRange={setRange} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className=' h-full w-full overflow-x-hidden'>
                <AnimatePresence mode='wait'>
            {
                activeTab === 'operations' ? 
                <motion.div className='h-full' key={"depenses-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <OperationsContent range={range}/>
                </motion.div> :
                activeTab === 'clients' ? <motion.div className='h-full' key={"contrats-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ClientsContent range={range}/>
                </motion.div> :
                activeTab === 'financiers' ? <motion.div className='h-full' key={"factures-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <FinanceContent range={range}/>
                </motion.div> :
                null
            }
            </AnimatePresence>
        </div>
    </div>
  )
}

export default PerformancePage