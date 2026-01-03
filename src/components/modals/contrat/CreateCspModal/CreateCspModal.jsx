import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from 'react';
import CreateCspStep1 from './CreateCspStep1';
import CreateCspStep2 from './CreateCspStep2';
import CreateCspStep3 from './CreateCspStep3';
import CreateCspStep4 from './CreateCspStep4';
import { Check, Loader2, X } from 'lucide-react'; 
import {useAddContratSp } from "../../../../api/queries/contrat/useAddContratSp";
import ChooseParams from './ChooseParams';
import PickOptions from './PickOptions';
import ConfirmContratSp from './ConfirmContratSp';
import { Printer, RotateCw } from "lucide-react";
import { SuccessModal , ErrorModal } from '../../StatusModals';
import { formatDateTime } from '../../../../utils/datautils';
import { printText } from '../../../../utils/printFunction';
import { useStore } from '../../../../store/store';
import { formatDateDDLLLLYYYY, formatDateDDMMYYYY, formatTimeHHmm } from '../../../../utils/dateConverter';
import CreateCspStep5 from './CreateCspStep5';

const CreateCspModal = ({open , setOpen}) => {
    const [activeTab, setActiveTab] = useState(0);

    const fetchedOnce = React.useRef(false);

    const [loading , setLoading] = useState(false);
    const [printData, setPrintData] = useState(null);

    const user = useStore((state) => state.user);
   
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [ContratSpData, setContratSpData] = useState({});
    
    const { mutate: createContratSp, error , isPending } = useAddContratSp();

 
  const calculateTotals = () => {
    const vehiclePrice = ContratSpData.selected_offre?.prix_total_voiture || 0;
    
    const optionsPrice = (ContratSpData.selectedOptions || []).reduce((acc, key) => {
      // Map the price from the selected_offre object based on the key
      const price = ContratSpData.selected_offre?.[key] || 0;
      return acc + price;
    }, 0);

    return vehiclePrice + optionsPrice;
  };
   
  const totalAmount = calculateTotals();

    const resetState = () => {
      setActiveTab(0);
      setContratSpData({});
      setShowSuccessModal(false);
      setShowErrorModal(false);
    };

   
    const tabs = [
    { id: 0, label: 'Choisir les paramètres', description: "Sélectionnez les paramètres de base pour votre location" },
    { id: 1, label: 'Sélectionner un véhicule', description: "Choisissez le véhicule que vous souhaitez louer" },
    { id : 2, label: 'Sélectionner vos options', description: "Ajoutez des options supplémentaires à votre location" },
    { id: 3, label: 'Définir les données de contrat', description: "Remplissez les informations principales du contrat" },
    { id: 4, label: 'Informations Conducteur(s) ', description: "Ajoutez le conducteur principal et le conducteur additionnel si possible avec cette offre" },
    { id: 5, label: 'Informations de Paiement', description: "Enregistrez le paiement initial et la caution" },
    { id: 6, label: 'Sélectionner un client', description: "Identifiez la personne ou l'entreprise responsable pour lier ce contrat à son compte" },
    { id: 7, label: 'Confirmer le contrat', description: "Vérifiez les informations et confirmez la création du contrat" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
    case 0:
      return <ChooseParams ContratSpData={ContratSpData} setContratSpData={setContratSpData} next={() => setActiveTab(activeTab + 1)} />;

    case 1:
        return <CreateCspStep1 load={loading} prev={() => setActiveTab(activeTab - 1)} fetchedOnce={fetchedOnce} setLoading={setLoading} setContratSpData={setContratSpData} ContratSpData={ContratSpData} next={() => setActiveTab(activeTab + 1)} />;
    case 2 :
        return <PickOptions setActiveTab={setActiveTab} prev={() => setActiveTab(activeTab - 1)} next={() => setActiveTab(activeTab + 1)} setContratSpData={setContratSpData} ContratSpData={ContratSpData} />;
    case 3:
        return <CreateCspStep3 setContratSpData={setContratSpData} ContratSpData={ContratSpData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
    case 4:
        return <CreateCspStep4 setContratSpData={setContratSpData} ContratSpData={ContratSpData} next={() => setActiveTab(activeTab + 1)} prev={() => setActiveTab(activeTab - 1)} />;
    case 5:
        return <CreateCspStep5 ContratSpData={ContratSpData} setContratSpData={setContratSpData} prev={() => setActiveTab(activeTab - 1)}  next={() => setActiveTab(activeTab + 1)} totalAmount={totalAmount} />;
    case 6:
        return <CreateCspStep2 ContratSpData={ContratSpData} setContratSpData={setContratSpData} prev={() => setActiveTab(activeTab - 1)} next={() => setActiveTab(activeTab + 1)} />;
    case 7:
        return <ConfirmContratSp isPending={isPending} ContratSpData={ContratSpData} setContratSpData={setContratSpData} prev={() => setActiveTab(activeTab - 1)} next={() => handleCreateContratSp()} />;
    default:
        return null;
    }
  };
  
  const handleCreateContratSp = () => {
    // Transform data to match backend API format
    const transformedData = {
      conducteur: ContratSpData.conducteur ? {...ContratSpData.conducteur,
          date_naissance:  formatDateTime(ContratSpData.conducteur.date_naissance),
          date_delivrance_cin :ContratSpData?.conducteur?.date_delivrance_cin ? formatDateTime(ContratSpData?.conducteur?.date_delivrance_cin) : undefined,
          date_delivrance_permis : formatDateTime(ContratSpData.conducteur.date_delivrance_permis),
      } : null,
      conducteur_supp : ContratSpData.conducteur_supp ? {...ContratSpData.conducteur_supp,
          date_naissance:  formatDateTime(ContratSpData.conducteur_supp.date_naissance),
          date_delivrance_cin : ContratSpData?.conducteur_supp?.date_delivrance_cin ? formatDateTime(ContratSpData?.conducteur_supp?.date_delivrance_cin) : undefined,
          date_delivrance_permis : formatDateTime(ContratSpData.conducteur_supp.date_delivrance_permis),

      } : null  ,
        
      selectedOptions : ContratSpData.selectedOptions || [],
      numberOptions : ContratSpData.numberOptions || {},
      // Guest info instead of account
      ...(ContratSpData.existing_guest_id 
        ? { existing_guest_id: ContratSpData.existing_guest_id }
        : { guest_info: ContratSpData.guest_info }
      ),
    
      contract : {
        sequence_contrat: ContratSpData.numero_contrat ,
        commentaire_contrat: ContratSpData.commentaire_contrat || null,
        niveau_carburant_depart_contrat: ContratSpData.niveau_carburant_depart || null,
      },

      paiement : {
      montant_paye: ContratSpData.montant_paye,
      mode_paiement: ContratSpData.mode_paiement,
      depot_garantie: ContratSpData.depot_garantie,
      reference_paiement: ContratSpData.reference_paiement
      },

      demande :{
        date_debut: formatDateTime(ContratSpData.date_debut) ,
        date_fin: formatDateTime(ContratSpData.date_fin),
        lieu_depart: ContratSpData.lieu_depart ,
        lieu_retour: ContratSpData.lieu_retour ,
        deduction_agence: ContratSpData.deduction_agence || null,
        negotiable_livraison : ContratSpData?.livraison ?? null,
      },
      id_offre : ContratSpData.selected_offre.id_offre ,
      
    };
    
    console.log("transformedData:", transformedData); 
    // Use the mutate function to post the data
    createContratSp(transformedData
      ,{
        onSuccess: (data) => {
          setPrintData({
            ...data,
            birthDate : data?.birthDate ? formatDateDDLLLLYYYY(data.birthDate) : null,
            cin_deliver : data?.cin_deliver ? formatDateDDMMYYYY(data.cin_deliver) : null,
            nationality : data?.nationalite || null,
            permis_deliver : data?.permis_deliver ? formatDateDDMMYYYY(data.permis_deliver) : null,
            birthDate_cond : data?.birthDate_cond ? formatDateDDLLLLYYYY(data.birthDate_cond) : null,
            cin_deliver_cond : data?.cin_deliver_cond ? formatDateDDMMYYYY(data.cin_deliver_cond) : null,
            permis_deliver_cond : data?.permis_deliver_cond ? formatDateDDMMYYYY(data.permis_deliver_cond) : null,
            location: user?.agency?.name_agency || '',
            date_debut: data?.date_debut ? formatDateDDMMYYYY(data.date_debut) : null,
            heure_debut: data?.date_debut ? formatTimeHHmm(data.date_debut) : null,
            date_retour: data?.date_retour ? formatDateDDMMYYYY(data.date_retour) : null,
            heure_retour: data?.date_retour ? formatTimeHHmm(data.date_retour) : null,
            date_depot: data?.date_depot ? formatDateDDMMYYYY(data.date_depot) : null,
          });
          setShowSuccessModal(true);
          // Reset form data
          setContratSpData({});
          setActiveTab(0);
        },
        onError: () => {
          setShowErrorModal(true);
          setContratSpData({});
          setActiveTab(0);
        }
      }
    );
  };


  return (
      <Dialog open={open} onOpenChange={setOpen} modal>

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
          button2={ <>
          <X className="mb-0.5" />
            Fermer
          </>}
          onViewOffers={
            () => {
              setOpen(false);
              resetState();
            }
          }
          
        /> : showErrorModal ?
        <ErrorModal 
          title="Contrat non établi"
          onRetry={resetState}
          button1={ <>
          <RotateCw className="mb-0.5" />
           Réessayer avec d’autres paramètres
           </>}
          errorMessage={error?.response?.data?.message} // Pass the entire error object
        /> : 

        <DialogContent className={`flex  ${(activeTab === 0 || (loading && fetchedOnce.current === false)) ? 'h-auto max-w-[600px] min-h-[494px]'  : activeTab === 3 ? 'h-[710px] max-w-[996px]' : 'h-[710px] max-w-[996px]'} scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col`}>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="w-full leading-tight"> 
              {tabs[activeTab].label}
            </DialogTitle>
            <DialogDescription className='leading-tight text-base -mt-2'>
              {tabs[activeTab].description}
            </DialogDescription>
            
            <Separator />
            
            {/* Steps counter */}
            {
              (activeTab > 0  && fetchedOnce.current ) &&
              <div className="w-full flex items-center h-10 mt-1 gap-2">
                {tabs.map((tab, index) => (
                  <React.Fragment key={`fragment-${index}`}>
                    <span className={`rounded-full relative z-10 shrink-0 leading-none flex items-center transition-all duration-300 ease-in-out justify-center font-semibold ${activeTab >= tab.id ? 'text-white bg-rod-accent' : 'bg-gray-200 text-gray-500'} ${activeTab === tab.id ? 'w-8 h-8 ring-4 ring-red-100' : 'w-8 h-8'}`}>
                      {activeTab === tab.id ?
                        <span  className=" text-white text-xl flex items-center justify-center leading-none rounded-full " >
                            {index + 1}
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
            }
          </DialogHeader>

          {/* Tab Content */}
          {(activeTab <= 7 && !isPending) ? (
            <div className="overflow-hidden h-full flex-1 flex flex-col">
              {renderTabContent()}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="animate-spin" />
              <span className="ml-2">Création de contrat en cours...</span>
            </div>
          )}

        </DialogContent>
      }
    </Dialog>

   
  );
}

export default CreateCspModal