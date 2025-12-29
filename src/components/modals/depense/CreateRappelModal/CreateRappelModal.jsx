import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Check, Loader2, CalendarSync,Plus, RefreshCcw} from 'lucide-react';
import CreateRappelStep2 from "./CreateRappelStep2";
import CreateRappelStep3 from "./CreateRappelStep3";
import useAddRappel from "../../../../api/queries/depense/rappel/useAddRappel";
import React from 'react';
import { SuccessModal, ErrorModal } from "../../StatusModals";
import CreateStep1 from "../../offre/CreateOffreModal/CreateStep1";
import { useFetchGarageAll } from "../../../../api/queries/garage/useFetchGarageAll";
import { startTransition } from "react";
import { startOfDay } from "date-fns";
import { formatDateTime } from "../../../../utils/datautils";

function CreateRappelModal({selected , setSelected}) {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [RappelData, setRappelData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
 
  const { mutate: createRappel, isPending, isSuccess, isError, error } = useAddRappel();

  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
      setActiveTab(0);
      setRappelData({});
      setShowSuccessModal(false);
      setShowErrorModal(false);
      }, 200);
    }
  }, [open]);

  // Close modal on successful creation and show success modal
  useEffect(() => {
    if (isSuccess) {
      setShowSuccessModal(true);
    }
  }, [isSuccess]);

  // Show error modal on error
  useEffect(() => {
    if (isError) {
      setShowErrorModal(true);
    }
  }, [isError]);

  // Reset state when modals are closed
  const resetState = () => {
    setActiveTab(0);
    setRappelData({});
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleViewRappels= () => {
    setOpen(false);
    if(selected!==1) {
      setSelected(1);
    }
  };

  const handlePublishAnother = () => {
    resetState();
  };

  const tabs = [
    { id: 0, label: 'Choisir l’objet du rappel', description: "Sélectionnez ce pour quoi vous souhaitez recevoir un rappel : un véhicule de la flotte ou une dépense générale de l’agence." },
    { id: 1, label: 'Détails de rappel', description: "Indiquez les informations du rappel : date, type de dépense, montant, périodicité…" },
    { id: 2, label: `Confirmer et activer le rappel`, description: "Vérifiez les informations et confirmez le rappel." } 
  ];

  const handleCreateRappel = () => {
    // Transform data to match backend API format
    const transformedData = { 
      id_garage: RappelData.id_garage,
      date_debut : formatDateTime(startOfDay(RappelData.date_debut)),
      date_fin: formatDateTime(RappelData.date_fin_rappel),
      type_depense: RappelData.type_depense,
      montant:RappelData.montant_depense ? parseFloat(RappelData.montant_depense) : undefined,
      delai: Number(RappelData.delai),
      periodicite: RappelData.periodicite,
    };
    console.log('transformed data', transformedData);
    // Use the mutate function to post the data
    createRappel(transformedData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CreateStep1 setData={setRappelData} data={RappelData} next={() => startTransition(() => setActiveTab(activeTab + 1))} mode={"depense"} useMutation={useFetchGarageAll} />;
      case 1:
        return <CreateRappelStep2 setRappelData={setRappelData} RappelData={RappelData } next={() =>  startTransition(() => {setActiveTab((prev) => prev + 1);})} prev={() =>  startTransition(() => {setActiveTab((prev) => prev - 1);})} />;
      case 2:
        return <CreateRappelStep3 RappelData={RappelData} prev={() =>startTransition(() => setActiveTab(activeTab - 1))} next={() => handleCreateRappel()} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal> 
      <DialogTrigger asChild> 
          <Button variant='outline' className='flex items-center leading-none gap-2 h-full'><CalendarSync/>Créer Rappel</Button>
      </DialogTrigger>
      {
        showSuccessModal ?
        <SuccessModal 
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          onViewOffers={handleViewRappels}
          onPublishAnother={handlePublishAnother}
          title={"Rappel établie"}
          description={"Votre rappel a été établi avec succès"}
          button1={[<><Plus  />
              Créer un autre rappel</>]}
          button2={[<><CalendarSync />
              Voir mes rappels</>]}
        />
        : showErrorModal ?
        <ErrorModal 
          open={showErrorModal}
          onOpenChange={setShowErrorModal}
          onViewOffers={handleViewRappels}
          onRetry={handlePublishAnother}
          errorMessage={error?.response?.data?.message}
          button1={[<><RefreshCcw  />
              Réessayer la création du rappel</>]}
          button2={[<><CalendarSync />
              Voir mes rappels</>]}
        />
       :
      <DialogContent className={`flex max-w-[996px] ${activeTab<1 ? 'h-[694px]' : activeTab<2 ? 'h-[625px]' : 'h-[466px] w-[946px]' } scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col `}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight"> 
            {tabs[activeTab].label}
          </DialogTitle>
          <DialogDescription className='leading-tight text-base -mt-2'>
            {tabs[activeTab].description}
          </DialogDescription>
          
          <Separator />
          
          {/* Steps counter */}
          <div className="w-full flex items-center h-10 mt-1 gap-2">
            {tabs.map((tab, index) => (
              <React.Fragment key={`fragment-${index}`}>
                <span className={`rounded-full relative z-10 shrink-0 leading-none flex items-center transition-all duration-300 ease-in-out justify-center font-semibold ${activeTab >= tab.id ? 'text-white bg-rod-accent' : 'bg-gray-200 text-gray-500'} ${activeTab === tab.id ? 'w-8 h-8 ring-4 ring-red-100' : 'w-8 h-8'}`}>
                  {activeTab === tab.id ?
                     <span  className=" text-white text-xl flex items-center justify-center leading-none rounded-full " >
                        {tab.id + 1}
                      </span>
                    : tab.id < activeTab ?
                    <Check strokeWidth={4} className="w-4 h-4 text-white" />
                    :
                    index + 1
                  }
                </span>

                {index < tabs.length - 1 && (
                  <div className={`w-full relative h-1 transition-colors duration-300 rounded-full bg-gray-200`}>
                    <div className={`w-full absolute rounded-full h-1 bg-red-500`}
                      style={{
                        transform: activeTab > tab.id ? 'scaleX(1)' : 'scaleX(0)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease-out, background-color 0.3s ease',
                      }}
                    />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </DialogHeader>

        {/* Tab Content */}
        {(activeTab <= 2 && !isPending) ? (
          <div className="overflow-hidden h-full">
            {renderTabContent()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
            <span className="ml-2">Création de la dépense en cours...</span>
          </div>
        )}

      </DialogContent>
      }
      
    </Dialog>
  );
} 

export default CreateRappelModal