import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Check, Plus , Loader2, PlusSquare, HandCoins,RotateCcw } from 'lucide-react';
import CreateDepenseStep2 from "./CreateDepenseStep2";
import CreateDepenseStep5 from "./CreateDepenseStep5"; 
import useAddDepense from "../../../../api/queries/depense/useAddDepense";  
import React from 'react';
import { SuccessModal, ErrorModal } from "../../StatusModals";
import CreateStep1 from "../../offre/CreateOffreModal/CreateStep1";
import { useFetchGarageAll } from "../../../../api/queries/garage/useFetchGarageAll";
import CreateDepenseStep3 from "./CreateDepenseStep3";
import CreateDepenseStep4 from "./CreateDepenseStep4";
import { useUploadFacturePhoto } from "../../../../api/queries/images/useUploadFactureDepense";
import UploadFiles from "./uploadFiles";

function CreateDepenseModal({selected , setSelected}) {
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [DepenseData, setDepenseData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
 
  const { mutate: createDepense, isPending, isSuccess, isError, error } = useAddDepense();
  const { mutate: uploadFacture, isPending: isUploadingFacture } = useUploadFacturePhoto();

  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
      setActiveTab(0);
      setDepenseData({});
      setShowSuccessModal(false);
      setShowErrorModal(false);
      }, 200);
    }
  }, [open]);

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
    setDepenseData({});
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleViewDepenses = () => {
    setOpen(false);
    // Ensure selected is set to 2 (Depenses tab)
    if(selected !== 0) {
      setSelected(0);
    }
  };

  const handlePublishAnother = () => {
    resetState();
  };

  const [maximizedFacture, setMaximizedFacture] = React.useState(null);


  const tabs = [
    { id: 0, label: 'Sélectionner un véhicule (ou dépense générale)', description: "Choisissez le véhicule concerné par la dépense, ou déclarez une dépense liée à l'agence (loyer, salaires…)." },
    { id: 1, label: 'Choisir un fournisseur', description: "Sélectionnez le fournisseur associé à la dépense." },
    { id: 2, label: 'Détails de la dépense', description: "Indiquez les informations de la dépense : type, montant, numéro de facture…" },
     { id: 3, label: 'Attachements', description: "Fournir les images associées à la dépense." },
    { id: 4, label: 'Paiement de la dépense', description: "Indiquez les informations de paiement de la dépense." }, 
    { id: 5, label: `Confirmer et déclarer la dépense`, description: "Vérifiez les informations et confirmez la dépense." } 
  ];

  const handleCreateDepense = () => {
    // Transform data to match backend API format
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
    
    // Add montant_interet only if it exists (for leasing)
    if (DepenseData.montant_interet !== undefined && DepenseData.montant_interet !== null && DepenseData.montant_interet !== '') {
      transformedData.montant_interet = parseFloat(DepenseData.montant_interet);
    }
    
    // Create the depense first
    createDepense(transformedData, {
      onSuccess: (response) => {
        console.log('✅ Success response:', response);
        // Handle both wrapped and unwrapped responses
        const newDepenseId = response.data?.id_depense || response.id_depense;
        console.log('🆔 New depense ID:', newDepenseId);
        
        // If there's a photo, upload it
        if (DepenseData.files && DepenseData.files.length > 0 && newDepenseId) {
          console.log('📤 Uploading photo for depense ID:', DepenseData.files);
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
                // Don't show error modal for photo upload failure - the depense was created successfully
              }
            }
          );
        }
      },
      onError: (error) => {
        console.error('❌ Error caught:', error);
        console.error('Response:', error.response?.data);
      }
    });
  };

  const isProcessing = isPending || isUploadingFacture;
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CreateStep1 setData={setDepenseData} data={DepenseData} next={() => setActiveTab(activeTab + 1)} mode={"depense"} useMutation={useFetchGarageAll} />;
      case 1:
        return <CreateDepenseStep2 setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 2:
        return <CreateDepenseStep3 setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 3:
        return <UploadFiles setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 4:
        return <CreateDepenseStep4 setDepenseData={setDepenseData} DepenseData={DepenseData } next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 5:
        return <CreateDepenseStep5 isPending={isProcessing}  DepenseData={{facture_image_path: images , recu_depense : DepenseData.numero_facture ,...DepenseData}} prev={() => setActiveTab(activeTab - 1)} next={() => handleCreateDepense()} maximizedFacture={maximizedFacture} setMaximizedFacture={setMaximizedFacture} />;
      default:
        return null;
    }
  };

 

  console.log("DepenseData in CreateDepenseModal:", DepenseData.files);

  return (
    <Dialog open={open} onOpenChange={(newOpenState) => {
                    // Only close the modal if the new state is 'false' (it's trying to close)
                    // AND the maximizedFacture is NOT open.
                    if (newOpenState === false && !maximizedFacture?.url) {
                        setOpen(false);
                    }else {
                      setOpen(true);
                    }
                      // If newOpenState is true (it's trying to open, which shouldn't happen here) or
                      // if newOpenState is false BUT the image is maximized, we block the close.
                      // This prevents the main dialog from closing when clicking the maximized image viewer's overlay.
                }} modal> 
      <DialogTrigger asChild> 
        <Button className="h-full" >
          <PlusSquare/> 
          Déclarer Dépense
        </Button>
      </DialogTrigger>
      {
        showSuccessModal ?
        <SuccessModal 
          open={showSuccessModal}
          onOpenChange={setShowSuccessModal}
          onViewOffers={handleViewDepenses}
          onPublishAnother={handlePublishAnother}
          title="Dépense déclarée"
          description="Votre dépense a été déclarée avec succès"
          button1={<><Plus  />
              Déclarer une autre dépense</>}
          button2={<><HandCoins />
              Voir mes dépenses</>}
        />
        : showErrorModal ?
        <ErrorModal 
          open={showErrorModal}
          onOpenChange={setShowErrorModal}
          onViewOffers={handleViewDepenses}
          onRetry={handlePublishAnother}
          errorMessage={error?.response?.data?.message}
          button1={<><RotateCcw  />
              Réessayer la déclaration de la dépense</>}
          button2={<><HandCoins />
              Voir mes dépenses</>}
        />
       :
      <DialogContent className={`flex max-w-[996px] ${activeTab<2 ? 'h-[694px]' :  'h-auto' } scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col`}>
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
        {(activeTab <= 5 && !isProcessing  ) ? (
          <div className="overflow-hidden h-full">
            {renderTabContent()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 h-[400px]">
            <Loader2 className="animate-spin" />
            <span className="ml-2">
              {isPending ? 'Création de la dépense en cours...' : null }
            </span>
          </div>
        )}

      </DialogContent>
      }
      
    </Dialog>
  );
} 

export default CreateDepenseModal