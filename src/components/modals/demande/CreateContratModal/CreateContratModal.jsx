import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Check, Loader2, Printer, RotateCw, X } from 'lucide-react';
import CreateContratStep1 from "./CreateContratStep1";
import CreateContratStep2 from "./CreateContratStep2";
import CreateContratStep3 from "./CreateContratStep3";
import CreateContratStep4 from "./CreateContratStep4";
import CreateContratStep5 from "./CreateContratStep5";
import { useAddContrat } from "../../../../api/queries/demande/useAddContrat";
import React from 'react';
import { formatDateOnly } from "../../../../utils/datautils";
import { ErrorModal , SuccessModal } from "../../StatusModals";
import { formatDateDDLLLLYYYY, formatDateDDMMYYYY, formatTimeHHmm } from "../../../../utils/dateConverter";
import { printText } from "../../../../utils/printFunction";
import { useStore } from "../../../../store/store";

function CreateContratModal({open , setOpen , demande ,close }) {

  const [activeTab, setActiveTab] = useState(0);
  const user = useStore((state) => state.user);
  console.log("user in CreateContratModal", demande);
  // Initialize contratData with demande details
  const [contratData, setContratData] = useState({
    id_demande: demande?.id_demande,
    id_client: demande?.client?.id_client,
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [printData, setPrintData] = useState(null);
  
  const { mutate: createContrat, isPending, error } = useAddContrat();

  // Check if conducteur supplementaire is available in the offre
  const hasConducteurSupplementaire = demande?.prix_options_conducteur_add !== null && demande?.prix_options_conducteur_add !== undefined;

  useEffect(() => {
    if (open === false) {
      setTimeout(() => {
        setActiveTab(0);
        setContratData({
          id_demande: demande?.id_demande,
          id_client: demande?.client?.id_client,
        });
        setShowSuccessModal(false);
        setShowErrorModal(false);
      }, 200);
    }
  }, [open, demande]);


  // Reset state when modals are closed
  const resetState = () => {
    setActiveTab(0);
    setContratData({
      id_demande: demande?.id_demande,
      id_client: demande?.client?.id_client,
    });
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };
  
  const handleCreateAnother = () => {
    resetState();
  };

  // Define steps based on whether conducteur supplementaire is available
  const getSteps = () => {
    const baseSteps = [
      { id: 0, label: "Informations générales", description: "Saisissez les informations générales de location" },
      { id: 1, label: "Informations du conducteur", description: "Configurez les détails du conducteur principal" },
    ]

    if (hasConducteurSupplementaire) {
      baseSteps.push({
        id: 2,
        label: "Conducteur supplémentaire",
        description: "Ajoutez un conducteur supplémentaire (optionnel)",
      })
    }

    baseSteps.push({
      id: hasConducteurSupplementaire ? 3 : 2,
      label: "Informations de Paiement",
      description: "Enregistrez le paiement initial et la caution",
    })

    baseSteps.push({
      id: hasConducteurSupplementaire ? 4 : 3,
      label: "Confirmer contrat de location",
      description: "Vérifiez les informations et confirmez le contrat",
    })

    return baseSteps;
  };

  const tabs = getSteps();

  const handleCreateContrat = () => {

    console.log("contratData before transform:", contratData.livraison , demande?.offre?.livraison);
  // Transform data to match backend API format
  const transformedData = {
    id_demande_contrat: contratData.id_demande,
    sequence_contrat: contratData.numero_contrat,
    commentaire_contrat: contratData.commentaire_contrat,
    id_client_contrat: contratData.id_client,

    negotiated_livraison_price: (demande?.offre?.livraison == null || demande?.offre?.livraison === "FREE"  ) ? undefined : contratData.livraison,

    niveau_carburant_depart_contrat: contratData.niveau_carburant_depart,
    deduction_agence: contratData.deduction_agence || null,
    //payment details
    montant_paye: contratData.montant_paye,
    mode_paiement: contratData.mode_paiement,
    depot_garantie: contratData.depot_garantie,
    reference_paiement: contratData.reference_paiement,
    // Conducteur principal
    conducteur_contrat:  contratData.has_conducteur ? {
      nom_prenom: contratData.conducteur_nom_prenom,
      date_naissance: formatDateOnly(contratData.conducteur_date_naissance),
      cin_passport: contratData.conducteur_cin_passport,
      nationalite: contratData.conducteur_nationalite,
      date_delivrance_cin: contratData?.conducteur_date_delivrance_cin ? formatDateOnly(contratData.conducteur_date_delivrance_cin) : null,
      permis_conduire: contratData.conducteur_permis_conduire,
      date_delivrance_permis: formatDateOnly(contratData.conducteur_date_delivrance_permis),
      adresse: contratData.conducteur_adresse,
      telephone: contratData.conducteur_telephone,
    } : null,
    
    // Conducteur supplémentaire
    ...(hasConducteurSupplementaire && contratData.has_conducteur_supplementaire && {
      conducteur_Sup_contrat: {
        nom_prenom: contratData.conducteur_supp_nom_prenom,
        date_naissance: formatDateOnly(contratData.conducteur_supp_date_naissance),
        cin_passport: contratData?.conducteur_supp_cin_passport,
        nationalite: contratData?.conducteur_supp_nationalite,
        date_delivrance_cin: contratData?.conducteur_supp_date_delivrance_cin ? formatDateOnly(contratData.conducteur_supp_date_delivrance_cin) : null,
        permis_conduire: contratData.conducteur_supp_permis_conduire,
        date_delivrance_permis: formatDateOnly(contratData.conducteur_supp_date_delivrance_permis),
        adresse: contratData.conducteur_supp_adresse,
        telephone: contratData.conducteur_supp_telephone,
      }
    })
  };

  console.log("transformedData:", transformedData);
  createContrat(transformedData,
    {
    onSuccess: (data) => {
      setPrintData({
        ...data,
        birthDate : formatDateDDLLLLYYYY(data.birthDate),
        cin_deliver : data?.cin_deliver ? formatDateDDMMYYYY(data.cin_deliver) : null,
        nationality : data?.nationalite || null,
        permis_deliver : formatDateDDMMYYYY(data.permis_deliver),
        birthDate_cond : data.birthDate_cond ? formatDateDDLLLLYYYY(data.birthDate_cond) : null,
        cin_deliver_cond : data?.cin_deliver_cond ? formatDateDDMMYYYY(data.cin_deliver_cond) : null,
        permis_deliver_cond : data.permis_deliver_cond ? formatDateDDMMYYYY(data.permis_deliver_cond) : null,
        location: user.agency.name_agency,
        date_debut: formatDateDDMMYYYY(data.date_debut),
        heure_debut: formatTimeHHmm(data.date_debut),
        date_retour: formatDateDDMMYYYY(data.date_retour),
        heure_retour: formatTimeHHmm(data.date_retour),
        date_depot: formatDateDDMMYYYY(data.date_depot),
      });
      close();
      setShowSuccessModal(true);

      // Reset form data
      setContratData({});
      setActiveTab(0);
    },
    onError: () => {
      setShowErrorModal(true);
      setContratData({});
      setActiveTab(0);
    }
  }
  );
};

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <CreateContratStep1 
            setContratData={setContratData} 
            contratData={contratData} 
            livraisonNegotiable={demande?.offre?.livraison}
            livraisonPrice={demande?.prix_options_livraison}
            depot={demande?.offre?.depot_pol}
            next={() => setActiveTab(activeTab + 1)} 
          />
        );
      case 1:
        return (
          <CreateContratStep2 
            conducteur={demande?.conducteur || null}
            setContratData={setContratData} 
            contratData={contratData} 
            doubleSkip={hasConducteurSupplementaire ? () => setActiveTab(activeTab + 2) : () => setActiveTab(activeTab + 1)}
            next={() => setActiveTab(activeTab + 1)} 
            prev={() => setActiveTab(activeTab - 1)} 
          />
        );
      case 2:
        if (hasConducteurSupplementaire) {
          return (
            <CreateContratStep3 
              conducteur={demande?.conducteur_Supp || null}
              setContratData={setContratData} 
              contratData={contratData} 
              next={() => setActiveTab(activeTab + 1)} 
              prev={() => setActiveTab(activeTab - 1)}
              isOptional={true}
            />
          );
        } else {
          // When no conducteur supplementaire, step 2 is payment
          return (
            <CreateContratStep4 
              setContratData={setContratData}
              contratData={contratData}
              totalAmount={demande?.prix_total || 0}
              next={() => setActiveTab(activeTab + 1)}
              prev={() => setActiveTab(activeTab - 1)}
            />
          );
        }
      case 3:
        if (hasConducteurSupplementaire) {
          // With conducteur supplementaire, step 3 is payment
          return (
            <CreateContratStep4 
              setContratData={setContratData}
              contratData={contratData}
              totalAmount={demande?.prix_total || 0}
              doublePrev={() => setActiveTab(activeTab - 2)}
              hasConducteurSupplementaire={hasConducteurSupplementaire}
              next={() => setActiveTab(activeTab + 1)}
              prev={() => setActiveTab(activeTab - 1)}
            />
          );
        } else {
          // Without conducteur supplementaire, step 3 is confirmation
          return (
            <CreateContratStep5 
              isPending={isPending}
              contratData={contratData} 
              setContratData={setContratData}
              prev={() => setActiveTab(activeTab - 1)} 
              next={() => handleCreateContrat()}
              demande={demande}
            />
          );
        }
      case 4:
        // Step 4 only exists when hasConducteurSupplementaire is true
        return (
          <CreateContratStep5 
            isPending={isPending}
            contratData={contratData} 
            setContratData={setContratData}
            prev={() => setActiveTab(activeTab - 1)} 
            next={() => handleCreateContrat()}
            demande={demande}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} modal>
        <DialogTrigger asChild>
          
        </DialogTrigger>
      {showSuccessModal ? 
        <SuccessModal
          title="Contrat établi"
          description="Votre contrat de location a été établi avec succès"
          button1Disabled={!printData || !user?.config}
          button1={ <>
              <Printer  />
             Imprimer le contrat
             </>}
          onPublishAnother={() => {
            printText(user.config || null
              , printData || null);
          }}
          onViewOffers={setOpen}
          button2={
            <>
            <X className="mb-0.5" />
              Fermer
            </>
          }
          
        /> : showErrorModal ?
        <ErrorModal 
          title="Contrat non établi"
          onRetry={handleCreateAnother}
          button1={ <>
          <RotateCw className="mb-0.5" />
           Réessayer la création du contrat
           </>}
          errorMessage={error?.response.data.message} // Pass the entire error object
          onViewOffers={setOpen}
          button2={
            <>
            <X className="mb-0.5" />
              Fermer
            </>
          }
        /> : 
      
        <DialogContent className={`flex max-w-[996px] ${activeTab === 0 ? 'h-fit' : 'max-h-[730px]' } scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col overflow-hidden transition-all duration-300 ease-in-out`}>
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
                       <span className=" text-white text-xl flex items-center justify-center leading-none rounded-full " >
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
          {(activeTab <= tabs.length - 1 && !isPending) ? (
            <div className=" h-full">
              {renderTabContent()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-[350px]">
              <Loader2 className="animate-spin" />
              <span className="ml-2">Création du contrat en cours...</span>
            </div>
          )}

        </DialogContent>
      }
    </Dialog>
  );
}

export default CreateContratModal;