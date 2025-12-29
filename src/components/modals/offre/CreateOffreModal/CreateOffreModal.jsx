import { Dialog,  DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from 'react';
import { Check,  Loader2 ,Plus , ShoppingCart,RefreshCcw } from 'lucide-react';
import CreateStep1 from "./CreateStep1";
import CreateStep2 from "./CreateStep2";
import CreateStep3 from "./CreateStep3";
import CreateStep4 from "./CreateStep4";
import CreateStep5 from "./CreateStep5";
import CreateStep6 from "./CreateStep6";
import useAddOffre from "../../../../api/queries/offre/useAddOffre"; 
import { SuccessModal, ErrorModal } from "../../StatusModals";
import React from 'react';
import { useFetchGarageDispo } from "../../../../api/queries/garage/useFetchGarageDispo"; 
import CreateStep7 from "./CreateStep7";

function CreateOffreModal({open , close , id_garage ,startingStep = 0}) {
  const [activeTab, setActiveTab] = useState(startingStep);
  const [offreData, setOffreData] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  const { mutate: createOffre, isPending, isSuccess, isError, error } = useAddOffre();

  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
      setActiveTab(startingStep);
      setOffreData({});
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
    setActiveTab(startingStep);
    setOffreData({});
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  const handleViewOffers = () => {
    close();
  };

  const handlePublishAnother = () => {
    resetState();
  };

  const tabs = [
    { id: 0, label: 'Sélectionner un véhicule', description: "Choisissez le véhicule que vous souhaitez mettre en location" },
    { id: 1, label: 'Définir la période de disponibilité', description: "Configurez les dates de disponibilité pour votre offre" },
    { id: 2, label:'Configurer les tarifs' , description: "Définissez les prix et options tarifaires de votre location" },
    { id: 3, label: 'Définir la zone de disponibilité', description:"Configurez les zones de disponibilité pour votre offre"  },
    { id: 4, label: 'Ajouter les Politiques', description: "Configurez les politiques et conditions de location" },
    { id: 5, label: 'Ajouter les Options', description: "Configurez les options de l'offre" },
    { id: 6, label: 'Confirmer et publier l\'offre', description: "Vérifiez les informations et confirmez la publication" }
  ];

const handleCreateOffre = () => {
  // Helper function to safely parse numeric values
  const safeParseFloat = (value, defaultValue = null) => {
    if (value && value.toString().trim() !== '') {
      const parsed = parseFloat(value);
      return !isNaN(parsed) ? parsed : defaultValue;
    }
    return defaultValue;
  };



  const transformedData = {
    // Basic offer information
    id_garage: startingStep === 1 ? id_garage : offreData.id_garage,
    gouvernorat: offreData.gouvernorat_offre,
    date_fin: offreData.date_fin_offre?.toISOString(),
    prix_jour: safeParseFloat(offreData.prix_jour_offre),
    
    // Fixed: Check for prix_dynamique_offre array existence
    prix_dynamique: offreData.avec_prix_dynamique && offreData.prix_dynamique_offre ? 
      offreData.prix_dynamique_offre.reduce((acc, option) => {
        if (option.days && option.price) {
          acc[option.days] = safeParseFloat(option.price);
        }
        return acc;
      }, {}) : null,

    // Nested optiondemandeoffre object
    optiondemandeoffre: {
      min_jour_demande_offre:  parseInt(offreData.min_jour_demande_offre) || null,
      max_jour_demande_offre: parseInt(offreData.max_jour_demande_offre) || null,
      long_term: Boolean(offreData?.offreLongTerm)
    },

    // Nested policies object
    politiques: {
      depot_pol: safeParseFloat(offreData.depot_pol),
      modification_pol: safeParseFloat(offreData.modification_pol),
      annulation_pol: safeParseFloat(offreData.annulation_pol),
      anciennite_permis_pol: safeParseFloat(offreData.anciennite_permis_pol, 0),
      age_minimale_pol: safeParseFloat(offreData.age, 0),
      carburant_pol: offreData.carburant_pol || "MEME_NIVEAU",
      livraison_pol: offreData.livraison_pol || "AGENCE",
      kilometrage_pol: offreData.kilometrage_pol ? safeParseFloat(offreData.kilometrage_pol) : null,
      penalite_kilo: offreData.type_penalite,
      prix_penalite_kilo: safeParseFloat(offreData.montant_penalite) || null ,
    },

    // Nested options object - Fixed to use actual values
    optionoffre: {
      chauffeur: offreData?.selectedOptions["chauffeur"] ? {
        ...offreData.selectedOptions["chauffeur"],
        value: offreData.selectedOptions["chauffeur"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["chauffeur"].value
      } : null,
      wifi: offreData?.selectedOptions["wifi"] ? {
        ...offreData.selectedOptions["wifi"],
        value: offreData.selectedOptions["wifi"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["wifi"].value
      } : null,
      gps: offreData?.selectedOptions["gps"] ? {
        ...offreData.selectedOptions["gps"],
        value: offreData.selectedOptions["gps"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["gps"].value
      } : null,
      rehausseur: offreData?.selectedOptions["rehausseur"] ? {
        ...offreData.selectedOptions["rehausseur"],
        value: offreData.selectedOptions["rehausseur"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["rehausseur"].value
      } : null,
      siege_bebe: offreData?.selectedOptions["siege_bebe"] ? {
        ...offreData.selectedOptions["siege_bebe"],
        value: offreData.selectedOptions["siege_bebe"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["siege_bebe"].value
      } : null,
      siege_enfant: offreData?.selectedOptions["siege_enfant"] ? {
        ...offreData.selectedOptions["siege_enfant"],
        value: offreData.selectedOptions["siege_enfant"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["siege_enfant"].value
      } : null,
      plein_carburant: offreData?.selectedOptions["plein_carburant"] ? {
        ...offreData.selectedOptions["plein_carburant"],
        value: offreData.selectedOptions["plein_carburant"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["plein_carburant"].value
      } : null,
      livraison: offreData?.selectedOptions["livraison"] ? {
        ...offreData.selectedOptions["livraison"],
        value: offreData.selectedOptions["livraison"].pricingMode === "FREE" || offreData.selectedOptions["livraison"].pricingMode === "NEGOTIABLE" ? 0 : offreData.selectedOptions["livraison"].value
      } : null,
      assurance_PR: offreData?.selectedOptions["assurance_PR"] ? {
        ...offreData.selectedOptions["assurance_PR"],
        value: offreData.selectedOptions["assurance_PR"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["assurance_PR"].value
      } : null,
      assurance_TR: offreData?.selectedOptions["assurance_TR"] ? {
        ...offreData.selectedOptions["assurance_TR"],
        value: offreData.selectedOptions["assurance_TR"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["assurance_TR"].value
      } : null,
      conducteur_add: offreData?.selectedOptions["conducteur_additionnel"] ? {
        ...offreData.selectedOptions["conducteur_additionnel"],
        value: offreData.selectedOptions["conducteur_additionnel"].pricingMode === "FREE" ? 0 : offreData.selectedOptions["conducteur_additionnel"].value
      } : null,
    }, 
  };
  
  console.log("transformedData:", transformedData); 
  createOffre(transformedData);
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <CreateStep1 setData={setOffreData} data={offreData} next={() => setActiveTab(activeTab + 1)} useMutation={useFetchGarageDispo} />;
      case 1:
        return <CreateStep2 setOffreData={setOffreData} offreData={offreData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} fromGarageMode={startingStep === 1} />;
      case 3:
        return <CreateStep7 setOffreData={setOffreData} offreData={offreData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 2:
        return <CreateStep3 setOffreData={setOffreData} offreData={offreData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 4:
        return <CreateStep4 setOffreData={setOffreData} offreData={offreData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 5:
        return <CreateStep5 setOffreData={setOffreData} offreData={offreData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
      case 6:
        return <CreateStep6 isPending={isPending} offreData={offreData} prev={() => setActiveTab(activeTab - 1)} next={() => handleCreateOffre()} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={close} modal> 
      {
        showSuccessModal ? 
        <SuccessModal
          onViewOffers={handleViewOffers}
          onPublishAnother={handlePublishAnother}
          title={"Offre publiée"}
          description={"Votre offre a été publiée avec succès"}
          button1={<><Plus  />
             Publier un autre offre</>}
          button2={<><ShoppingCart />
              Voir mes offres</>}
        /> : showErrorModal ?
        <ErrorModal 
          onViewOffers={handleViewOffers}
          onRetry={handlePublishAnother}
          errorMessage={error?.response?.data?.message}
          button1={<><RefreshCcw  />
              Réessayer la publication de l'offre</>}
          button2={<><ShoppingCart />
              Voir mes offres</>}
        /> : 
      
      <DialogContent className="flex max-w-[996px] h-[694px] scale-80 desktop:scale-90 desktop-lg:scale-110  flex-col ">
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
        {(activeTab <= 6 && !isPending) ? (
          <div className="!h-[521px]">
            {renderTabContent()}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin" />
            <span className="ml-2">Création de l'offre en cours...</span>
          </div>
        )}

      </DialogContent>

      }
    </Dialog>
  );
}

export default CreateOffreModal;