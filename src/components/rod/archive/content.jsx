import React from 'react'
import Tablist from './tablist';
import KpisArchive from './kpis';
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'motion/react';
import { DepenseContent } from './depenseContent';
import { PaiementsContent } from './paimentsContent';
import { ContratsContent } from './contratContent';
import { FactureContent } from './factureContent';
import { AcquisitionsContent } from './acquisitionsContent';

const tabs = [
  {
    name: 'Dépenses',
    value: 'depenses',
  },
  {
    name: 'Contrats',
    value: 'contrats',
  },
  {
    name: 'Factures',
    value: 'factures',
  }
  ,{
    name: 'Paiements',
    value: 'paiements',
  }
  ,{
    name: 'Acquisitions',
    value: 'acquisitions',
  }
]


const ArchiveContent = ({ year, month }) => {
    const [activeTab, setActiveTab] = React.useState('depenses');

  return (
    <div className='flex flex-col gap-4 h-full min-h-0' >
        <KpisArchive year={year} month={month} />
        
        <div><Tablist keyRef="archive-tablist" className={"my-2"} activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} /></div>
        <div className=' h-full w-full flex-1 min-h-0 '>
                <AnimatePresence mode='wait'>
            {
                activeTab === 'depenses' ? 
                <motion.div className='h-full' key={"depenses-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <DepenseContent year={year} month={month} />
                </motion.div> :
                activeTab === 'contrats' ? <motion.div className='h-full' key={"contrats-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <ContratsContent year={year} month={month} />
                </motion.div> :
                activeTab === 'factures' ? <motion.div className='h-full' key={"factures-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <FactureContent year={year} month={month} />
                </motion.div> :
                activeTab === 'paiements' ? <motion.div className='h-full' key={"paiements-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PaiementsContent year={year} month={month} />
                </motion.div> :
                activeTab === 'acquisitions' ? <motion.div className='h-full' key={"acquisitions-archive"} initial={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AcquisitionsContent  year={year} month={month} />
                </motion.div> :
                null
            }
            </AnimatePresence>
        </div>
        
    </div>
  )
}

export default ArchiveContent