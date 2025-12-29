import { Car,  SearchX } from 'lucide-react';
import GarageCarCard from './garagecarcard';
import GarageCarCardSkeleton from './garageCarCardSkeleton';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import CreateOffreModal from '../../modals/offre/CreateOffreModal/CreateOffreModal';

// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from 'framer-motion';
import ModalViewCar from '../../modals/garage/ModalViewCar/modalviewcar';
import { UpdateKilometrage } from '../../modals/garage/updateKilometrage/updateKilometrage';
import DetailContratModal from '../../modals/contrat/DetailContratModal/DetailContratModal';

const GarageContent = ({ table , isLoading ,isError=false , refetch = () => {}}) => {
  const rows = table.getRowModel().rows;
  const originalRows = table.getPreFilteredRowModel().rows;

  // offre modal state
  const [offreOpen, setOffreOpen] = useState({open:false,id_garage:null});
  const [carModal , setCarModal] = useState({ open: false, id_garage: null });
  const [kilometrage, setKilometrage] = useState({ open: false, id: null , kilometrage: null });
  const [contratModal, setContratModal] = useState({ open: false, id_contrat: null });

  console.log("rows in GarageContent", rows);
  console.log("originalRows in GarageContent", originalRows);

  return (
    <div
      id="content"
      className="w-full h-full"
    >
      {
        isLoading  ? 
        <div
          className="w-full h-full grid grid-cols-[repeat(4,1fr)] grid-rows-[repeat(2,1fr)] gap-x-4 gap-y-4 desktop-lg:gap-x-6 desktop-lg:gap-y-6"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <GarageCarCardSkeleton key={index} />
          ))}
        </div>
        : 
        isError ?
        <div className="w-full h-full flex flex-col gap-2 items-center justify-center -mt-10">
          <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl text-gray-600 desktop-xl:text-xl text-lg  text-center text-wrap max-w-[640px]">
            Une erreur est survenue lors du chargement des données.
          </p>
          <Button className="mt-4" onClick={refetch}><RefreshCcw /> Rafraîchir </Button>
        </div>
        :

      rows.length > 0 ? (
        <>
        <AnimatePresence mode='wait'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          key={table.getState().pagination.pageIndex}
          className="w-full h-full grid grid-cols-[repeat(4,1fr)] grid-rows-[repeat(2,1fr)] gap-x-4 gap-y-4 desktop-lg:gap-x-6 desktop-lg:gap-y-6"
        >
          {rows.map(row => <GarageCarCard setContratModal={setContratModal} setKilometrage={setKilometrage} setCarModal={setCarModal} setOffreOpen={setOffreOpen} key={row.original.id_garage} car={row.original} />)}
        </motion.div>
        </AnimatePresence>

        { // create offer 
          offreOpen.open &&
          <CreateOffreModal open={offreOpen.open} close={() => setOffreOpen({open:false,id_garage:null})} id_garage={offreOpen.id_garage} startingStep={1} />
        }

        {// open car modal
          carModal.open &&
          <ModalViewCar open={carModal.open} setOpen={() => setCarModal({ open : false, id_garage: null })} vehicleId={carModal.id_garage} />

        }

        {
          contratModal.open && (
            <DetailContratModal open={contratModal.open} onClose={() => setContratModal({ open: false, id_contrat: null })} id={contratModal.id_contrat} />
          ) 
        }

        {
          // update kilometrage modal
          kilometrage.open &&
          <UpdateKilometrage open={kilometrage.open} setOpen={() => setKilometrage({ open: false, id: null, kilometrage: null })} id={kilometrage.id} kilometrage={kilometrage.kilometrage} />

        }
        </>
      ) : 
      
      (
        originalRows.length === 0 ? 
        <div className='w-full h-full flex flex-col gap-2 items-center justify-center'>
           <div className="laptop:h-12 desktop:h-12 desktop-lg:h-16  desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16  h-16  w-16  bg-red-100 flex items-center justify-center rounded-xl">
                  <Car className='text-rod-accent laptop:h-8 desktop:h-8 desktop-lg:h-10  desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10' />
            </div>
            <h3 className="laptop:text-xl desktop:text-xl  desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">Oups... Pas encore de voitures ici</h3>
            <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center max-w-[640px]">
              Ajoutez-en une dès maintenant pour commencer à recevoir des demandes de location.
            </p>
        </div>
        : rows.length === 0 && (
          <div className='w-full h-full flex flex-col gap-1 items-center justify-center'>
            <div className="laptop:h-12 desktop:h-12 desktop-lg:h-16  desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16  h-16  w-16  bg-rod-foreground flex items-center justify-center rounded-full">
                  <SearchX className=' laptop:h-8 desktop:h-8 desktop-lg:h-10  desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10' />
            </div>
            <h3 className="laptop:text-xl desktop:text-xl  desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">Oups... Aucun résultat trouvé</h3>
            <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center max-w-[640px]">
              Essayez d’ajuster vos filtres
            </p>
          </div>
          )
      )}
    </div>
  );
}

export default GarageContent;