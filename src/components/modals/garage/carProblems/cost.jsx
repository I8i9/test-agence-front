import {
  AlertDialog, 
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { CornerUpLeft, Loader2, Check, Plus, X } from "lucide-react"
import { useState, useEffect } from "react";
import useAddDepense from "../../../../api/queries/depense/useAddDepense";
import CreateDepenseStep2 from "../../depense/CreateDepenseModal/CreateDepenseStep2";
import CreateDepenseStep3 from "../../depense/CreateDepenseModal/CreateDepenseStep3";
import CreateDepenseStep4 from "../../depense/CreateDepenseModal/CreateDepenseStep4";
import CreateDepenseStep5 from "../../depense/CreateDepenseModal/CreateDepenseStep5";
import { useUploadFacturePhoto } from "../../../../api/queries/images/useUploadFactureDepense";
import React from 'react';
import UploadFiles from "../../depense/CreateDepenseModal/uploadFiles";

export const AssignCost = ({ id, type, open, setOpen, title }) => {
  const [showInitialDialog, setShowInitialDialog] = useState(open);
  const [showDepenseModal, setShowDepenseModal] = useState(false);
  const [activeTab, setActiveTab] = useState(1); // Start at step 1 (fournisseur)
  const [DepenseData, setDepenseData] = useState({ 
    id_garage: id,
    type_depense: type 
  });

  const [maximizedFacture, setMaximizedFacture] = useState(null);

  const { mutate: addDepense, isPending: isPendingCost } = useAddDepense();
  const { mutate: uploadFacture, isPending: isUploadingFacture } = useUploadFacturePhoto();

  // Sync external open state with internal dialog state
  useEffect(() => {
    setShowInitialDialog(open);
  }, [open]);

  // Handle continuing without adding a cost
  const handleWithoutCost = () => {
    setShowInitialDialog(false);
    setOpen(false);
  };

  // Handle showing the cost modal
  const handleShowCostModal = () => {
    setShowInitialDialog(false);
    setShowDepenseModal(true);
    setDepenseData({ 
      id_garage: id,
      type_depense: type 
    });
    setActiveTab(1);
  };

  // Handle creating cost
  const handleCreateCost = () => {
    const transformedData = {
      id_garage: DepenseData.id_garage,
      id_fournisseur: DepenseData.id_fournisseur,
      type_depense: DepenseData.type_depense,
      date_depense: DepenseData.date_depense,
      montant_depense: parseFloat(DepenseData.montant_depense),
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

    addDepense(transformedData, {
      onSuccess: (response) => {
        const newCostId = response.data?.id_depense || response.id_depense;

        // If there's a photo, upload it
        if (DepenseData.files && DepenseData.files.length > 0 && newCostId) {
          uploadFacture(
            {
              images: DepenseData?.files,
              id_depense: newCostId
            },
            {
              onSuccess: () => {
                console.log('✅ Photo uploaded successfully');
                setShowDepenseModal(false);
                setOpen(false);
              },
              onError: (uploadError) => {
                console.error('⚠️ Error uploading photo:', uploadError);
                setShowDepenseModal(false);
                setOpen(false);
              }
            }
          );
        } else {
          setShowDepenseModal(false);
          setOpen(false);
        }
      },
      onError: (error) => {
        console.error('❌ Error creating cost:', error);
      }
    });
  };

  // Reset when modal closes
  useEffect(() => {
    if (!showDepenseModal) {
      setTimeout(() => {
        setActiveTab(1);
        setDepenseData({ 
          id_garage: id,
          type_depense: type 
        });
      }, 200);
    }
  }, [showDepenseModal, id, type]);

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
        return <CreateDepenseStep2 setDepenseData={setDepenseData} DepenseData={DepenseData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 2:
        return <CreateDepenseStep3 setDepenseData={setDepenseData} DepenseData={DepenseData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 3:
        return <UploadFiles setDepenseData={setDepenseData} DepenseData={DepenseData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 4:
        return <CreateDepenseStep4 setDepenseData={setDepenseData} DepenseData={DepenseData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 5:
        return <CreateDepenseStep5 DepenseData={{ facture_image_path: images, ...DepenseData }} prev={() => setActiveTab(activeTab - 1)} next={() => handleCreateCost()} maximizedFacture={maximizedFacture} setMaximizedFacture={setMaximizedFacture} />;
      default:
        return null;
    }
  };

  const isProcessing = isPendingCost || isUploadingFacture;

  return (
    <>
      {/* Initial Dialog - Choose to add cost or not */}
      <AlertDialog open={showInitialDialog} onOpenChange={(isOpen) => {
        setShowInitialDialog(isOpen);
        if (!isOpen) setOpen(false);
      }}>
        <AlertDialogContent className="max-w-3xl w-full">
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="w-full flex items-center gap-3">
                <span className="p-2 bg-rod-foreground rounded-full flex items-center justify-center">
                  <CornerUpLeft className="w-5 h-5" />
                </span>
                <span className="text-lg">Ajouter une dépense ?</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Indiquez le montant à ajouter lors de la confirmation de {title}. Souhaitez-vous enregistrer une dépense ?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className='flex-row gap-2 justify-end'>
            <X className="absolute top-3 right-3 cursor-pointer opacity-70 hover:opacity-100 transition-opacity size-4" onClick={handleWithoutCost} />
            <Button onClick={handleWithoutCost} variant="ghost">
              Continuer sans dépense
            </Button>
            <Button onClick={handleShowCostModal}>
              <Plus className="h-4 w-4" />
              Enregistrer une dépense
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cost Creation Modal */}
      <Dialog open={showDepenseModal} onOpenChange={(newOpenState) => {
          if (newOpenState === false && !maximizedFacture?.url) { // Check if closing AND image is NOT maximized
              setShowDepenseModal(false);
          }
      }} modal>
        <DialogContent className={`flex max-w-[996px] ${activeTab < 2 ? 'h-[694px]' : 'h-auto'} scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col`}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="w-full leading-tight">
              {tabs[activeTab - 1].label}
            </DialogTitle>
            <DialogDescription className='leading-tight text-base -mt-2'>
              {tabs[activeTab - 1].description}
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
                {isPendingCost ? 'Création de la dépense en cours...' : 'Téléchargement de la facture en cours...'}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};