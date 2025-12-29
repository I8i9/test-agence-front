import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import DepensesTab from './DepensesTab';
import ImagesTab from './ImagesTab';
import DetailsTab from "./DetailsTab";
import { Banknote, Camera, HandCoins, Info } from 'lucide-react';
import { useState } from 'react';
import { useFetchDetailGarage } from '../../../../api/queries/garage/useFetchDetailGarage';
import { Loader2 } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import Status from "./status";

function ModalViewCar({ open, setOpen, vehicleId }) {
  const [activeTab, setActiveTab] = useState('details'); // Start with details


  const { data: vehicleDetails, isLoading, isError } = useFetchDetailGarage(vehicleId, { enabled: open === true });

  const tabs = [
    { id: 'details', label: 'Détails', icon: Info },
    { id: 'images', label: 'Images', icon: Camera },
    { id: 'status', label: 'Valeur', icon: Banknote },
    { id: 'depenses', label: 'Dépenses', icon: HandCoins }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab setOpen={setOpen} vehicleData={vehicleDetails} />;
      case 'images':
        return <ImagesTab
          front={vehicleDetails.front_image_garage}
          rear={vehicleDetails.rear_image_garage}
          left={vehicleDetails.left_image_garage}
          right={vehicleDetails.right_image_garage}
          interior={vehicleDetails.interior_image_garage}
          id_garage={vehicleDetails.id_garage}
        />;
      case 'depenses':
        return <DepensesTab vehicleId={vehicleId} />;
      case 'status':
        return <Status vehicule={vehicleDetails} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
      <DialogContent className={`flex max-w-[996px]  h-[710px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight">
            Mon Véhicule
          </DialogTitle>
          <DialogDescription className='leading-tight text-base -mt-2'>
            N'hésitez pas à mettre à jour les informations pour améliorer la visibilité de vos offres.
          </DialogDescription>
          <Separator />

          <div className="w-full flex items-center justify-between rounded-md p-1 bg-rod-foreground mt-1 relative overflow-hidden">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="w-full h-full py-1 cursor-pointer rounded-sm flex justify-center items-center gap-2 relative z-10 transition-all duration-100"
                >
                  {isActive && (
                    <motion.div
                    layoutId="TabGarageDetail"
                    className="absolute inset-0 rounded-sm bg-white"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  )}
                  <IconComponent className={`w-4 h-4 mb-0.5 z-10 shrink-0 ${isActive ? "text-rod-primary" : "text-gray-500"}`} />
                  <span className={`text-base font-medium z-10 whitespace-nowrap ${isActive ? "text-rod-primary" : "text-gray-500"}`}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col gap-3 items-center text-center justify-center h-full">
            <span className="bg-red-50 p-3 rounded-full"><Info className="text-rod-accent w-7 h-7" /></span>
            <p className="text-rod-accent">
              Une erreur s'est produite lors du chargement des détails du véhicule.
              <br />
              Veuillez réessayer plus tard.
            </p>
          </div>
        ) : (
          <div className="h-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0.3, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.3, y: -4 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ModalViewCar;
