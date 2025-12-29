import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button.jsx'
import { Wrench, CornerUpLeft, Loader2, CheckCircle, Check, Plus, X } from 'lucide-react'
import ToolTipCustom from "../../../customUi/tooltip";
import { useState, useEffect } from "react";
import { useUpdateGarageAvailability } from "../../../../api/queries/garage/useUpdateGarageAvailability"
import { AlertRed } from "../../../customUi/Alert";
import CreateDepenseStep2 from "../../depense/CreateDepenseModal/CreateDepenseStep2";
import CreateDepenseStep3 from "../../depense/CreateDepenseModal/CreateDepenseStep3";
import CreateDepenseStep4 from "../../depense/CreateDepenseModal/CreateDepenseStep4";
import CreateDepenseStep5 from "../../depense/CreateDepenseModal/CreateDepenseStep5";
import useAddDepense from "../../../../api/queries/depense/useAddDepense";
import { useUploadFacturePhoto } from "../../../../api/queries/images/useUploadFactureDepense";
import React from 'react';
import UploadFiles from "../../depense/CreateDepenseModal/uploadFiles";



export const MarkInRepair = ({id , status_garage , status_offre}) => {
    const [open, setOpen] = useState(false);
    const {mutate : updateGarageAvailabiliy } = useUpdateGarageAvailability();

    console.log("status_garage" , status_offre)

    const handleUpdate = () => {
    updateGarageAvailabiliy({
      id_garage:id, 
      fixCar:false,
      breakCar:true,
    });
    };

    return(
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <ToolTipCustom
          trigger={
            <Button onClick={() => setOpen(true)} variant="outline" size="icon" className="flex size-7 desktop-lg:size-9 desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm">
              <Wrench />
            </Button>
          }
          message="Marquer cette voiture comme en panne"
        />
      </AlertDialogTrigger>
      <AlertDialogContent  className="max-w-3xl w-full">
        <AlertDialogHeader>
          <AlertDialogTitle>
            <div className="w-full flex items-center gap-3">
              <span className=" p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                <Wrench className="w-5 h-5"/>
              </span>
              <span className="text-lg">Marquer comme en panne ?</span>
              </div>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Ce véhicule sera retiré de la location jusqu'à réparation.         
        </AlertDialogDescription>
        </AlertDialogHeader>

        {(status_garage === 'PUBLIE' && status_offre === 'ACTIVE') && (  
          <AlertRed
            title="Attention"
            description="Cette action mettra en pause l'offre actuellement publiée pour ce véhicule."
          />        
          )}

        <AlertDialogFooter className='w-full'>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>Confirmer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    )
}

export const MarkAvailable = ({ id, openOfferResumedAlert }) => {
  const [showInitialDialog, setShowInitialDialog] = useState(false);
  const [showDepenseModal, setShowDepenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // Start at step 2 (fournisseur)
  const [DepenseData, setDepenseData] = useState({ id_garage: id });

  const [maximizedFacture, setMaximizedFacture] = useState(null);

  const { mutate: updateGarageAvailabiliy, isPending: isPendingGarage } = useUpdateGarageAvailability();
  const { mutate: createDepense, isPending, } = useAddDepense();
  const { mutate: uploadFacture, isPending: isUploadingFacture } = useUploadFacturePhoto();

  // Handle marking car available without expense
  const handleWithoutCost = () => {
    updateGarageAvailabiliy(
      {
        id_garage: id,
        fixCar: true,
        breakCar: false,
      },
      {
        onSuccess: (data) => {
          setShowInitialDialog(false);
          if (data.offerResumed) {
            openOfferResumedAlert();
          }
        },
      }
    );
  };

  // Handle showing the depense modal
  const handleShowDepenseModal = () => {
    setShowInitialDialog(false);
    setShowDepenseModal(true);
    setDepenseData({ id_garage: id });
    setActiveTab(1);
  };

  // Handle creating depense
  const handleCreateDepense = () => {
    const transformedData = {
      id_garage: DepenseData.id_garage,
      id_fournisseur: DepenseData.id_fournisseur,
      type_depense: DepenseData.type_depense,
      date_depense: DepenseData.date_depense,
      montant_depense: parseFloat(DepenseData.montant_depense) ,
      rts_depense: parseFloat(DepenseData.rts_depense),
      numero_facture: DepenseData.numero_facture,
      tva_depense: parseFloat(DepenseData.tva_depense),
      description_depense: DepenseData.description_depense || '',
      deductible: DepenseData.deductible,
      montant_paye: parseFloat(DepenseData.montant_paye),
      mode_paiement: DepenseData.mode_paiement,
      reference_paiement: DepenseData.reference_paiement || '',
    };

    if (DepenseData.montant_interet !== undefined && DepenseData.montant_interet !== null && DepenseData.montant_interet !== '') {
      transformedData.montant_interet = parseFloat(DepenseData.montant_interet);
    }

    createDepense(transformedData, {
      onSuccess: (response) => {
        const newDepenseId = response.data?.id_depense || response.id_depense;

        // Mark car as available
        updateGarageAvailabiliy(
          { id_garage: id, fixCar: true, breakCar: false },
          {
            onSuccess: (garageData) => {
              // If there's a photo, upload it
              if (DepenseData.files && DepenseData.files.length > 0 && newDepenseId) {
                uploadFacture(
                  {
                    images: DepenseData?.files,
                    id_depense: newDepenseId
                  },
                  {
                    onSuccess: () => {
                      console.log('✅ Photo uploaded successfully');
                    },
                    onError: (uploadError) => {
                      console.error('⚠️ Error uploading photo:', uploadError);
                    }
                  }
                );
              }

              // Close modal and show offer resumed alert if needed
              setShowDepenseModal(false);
              if (garageData.offerResumed) {
                openOfferResumedAlert();
              }
            },
          }
        );
      },
      onError: (error) => {
        console.error('❌ Error creating depense:', error);
      }
    });
  };

  // Reset when modals close
  useEffect(() => {
    if (!showDepenseModal) {
      setTimeout(() => {
        setActiveTab(1);
        setDepenseData({ id_garage: id });
      }, 200);
    }
  }, [showDepenseModal, id]);

  const [images, setImages] = useState([]);
    useEffect(() => {
      if (DepenseData?.files) {
        // Create object URLs for each file
        const newImageUrls = DepenseData.files.map(file => URL.createObjectURL(file));
        setImages(newImageUrls);
      }
  
      // Cleanup function to revoke object URLs
      return () => {
        images.forEach(url => URL.revokeObjectURL(url));
      };
      
  }, [DepenseData?.files]);

  const tabs = [
    { id: 1, label: 'Choisir un fournisseur', description: "Sélectionnez le fournisseur associé à la dépense." },
    { id: 2, label: 'Détails de la dépense', description: "Indiquez les informations de la dépense : type, montant, numéro de facture…" },
     { id: 3, label: 'Attachements', description: "Fournir les images associées à la dépense." },
    { id: 4, label: 'Paiement de la dépense', description: "Indiquez les informations de paiement de la dépense." }, 
    { id: 5, label: `Confirmer et déclarer la dépense`, description: "Vérifiez les informations et confirmez la dépense." } 
  ];

const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <CreateDepenseStep2 setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 2:
        return <CreateDepenseStep3 setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 3:
        return <UploadFiles setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 4:
        return <CreateDepenseStep4 setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 5:
        return <CreateDepenseStep5  DepenseData={{facture_image_path: images ,...DepenseData}} prev={() => setActiveTab(activeTab - 1)} next={() => handleCreateDepense()} maximizedFacture={maximizedFacture} setMaximizedFacture={setMaximizedFacture} />;
      default:
        return null;
    }
  };

  const isProcessing = isPending || isUploadingFacture || isPendingGarage;

  return (
    <>
      {/* Initial Dialog - Choose to add expense or not */}
      <AlertDialog open={showInitialDialog} className="relative" onOpenChange={setShowInitialDialog}>
        <AlertDialogTrigger asChild>
          <ToolTipCustom
            trigger={
              <Button onClick={() => setShowInitialDialog(true)} variant="outline" className="flex size-7 desktop-lg:size-9 desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm">
                <CornerUpLeft />
              </Button>
            }
            message="Remettre cette voiture en service"
          />
        </AlertDialogTrigger>

        <AlertDialogContent className="max-w-3xl w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="w-full flex items-center gap-3">
                <span className="p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                  <CornerUpLeft className="w-5 h-5" />
                </span>
                <span className="text-lg">Marquer la voiture comme disponible ?</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ce véhicule sera marqué comme disponible et remis en location. Souhaitez-vous enregistrer une dépense de réparation ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className='flex-row gap-2 justify-end'>
            <X className="absolute top-3 right-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity size-4" onClick={() => setShowInitialDialog(false)} />
            <Button onClick={handleWithoutCost} variant="ghost" disabled={isPendingGarage}>
              {isPendingGarage ? <Loader2 className="animate-spin" /> : "Continuer sans dépense"}
            </Button>
            <Button onClick={handleShowDepenseModal}>
              <Plus className="h-4 w-4" />
              Enregistrer une dépense
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Depense Creation Modal */}
      <Dialog open={showDepenseModal} onOpenChange={(newOpenState) => {
          if (newOpenState === false && !maximizedFacture?.url) { // Check if closing AND image is NOT maximized
              setShowDepenseModal(false);
          }
      }} modal>
        <DialogContent className={`flex max-w-[996px] ${activeTab < 2 ? 'h-[694px]' : 'h-auto'} scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col`}>
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
                      <span className="text-white text-xl flex items-center justify-center leading-none rounded-full">
                        {tab.id}
                      </span>
                      : tab.id < activeTab ?
                        <Check strokeWidth={4} className="w-4 h-4 text-white" />
                        :
                        tab.id
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
          {(activeTab <= 5 && !isProcessing) ? (
            <div className="overflow-hidden h-full">
              {renderTabContent()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2">
              <Loader2 className="animate-spin" />
              <span className="ml-2">
                {isPending ? 'Création de la dépense en cours...' : isUploadingFacture ? 'Téléchargement de la facture en cours...' : 'Mise à jour du véhicule...'}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export const AlertOfferResumed = ({ open ,onClose}) => {
  return ( 
      <AlertDialog open={open} onOpenChange={onClose} >
        <AlertDialogContent className=''>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="w-full flex items-center gap-3">
                <span className="p-2 bg-green-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5"/>
                </span>
                <span className="text-lg text-emerald-600">Offre réactivée</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Le véhicule est à nouveau disponible et l’offre est active et visible pour les clients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              className="bg-emerald-600 cursor-pointer hover:bg-emerald-700"
            >
              Parfait, compris !
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  };