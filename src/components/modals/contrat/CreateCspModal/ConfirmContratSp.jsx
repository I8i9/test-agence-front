import React from 'react'
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInCalendarDays } from 'date-fns';
import TarificationCard from '../DetailContratModal/TarificationCard'
import DetailGeneralCard from '../DetailContratModal/DetailGeneraleCard'
import ConducteurCard from '../DetailContratModal/ConducteurCard';
import { ApplyDeduction } from '../../demande/CreateContratModal/ApplyDeduction';

const ConfirmContratSp = ({ContratSpData , setContratSpData , prev , next , isPending}) => {

  const calculateRetourKilometrage = () => {
      if( !ContratSpData?.selected_offre?.offre?.kilometrage_pol) return null;

      const days = differenceInCalendarDays(ContratSpData?.date_fin, ContratSpData?.date_debut);
      const allowedKilometrage = days * ContratSpData?.selected_offre?.offre?.kilometrage_pol;
      return ContratSpData?.selected_offre?.garage.kilometrage_garage + allowedKilometrage;
  };



    console.log(ContratSpData);
    const dataGeneral = {
      date_retour: ContratSpData?.date_fin || null,
      date_depart: ContratSpData?.date_debut || null,
      lieu_depart: ContratSpData?.lieu_depart || null,
      lieu_retour: ContratSpData?.lieu_retour || null,
      kilometrage_depart: ContratSpData?.selected_offre?.garage?.kilometrage_garage || null,
      kilometrage_retour: calculateRetourKilometrage(),
    }

    const options = {
    "Service Chauffeur": ContratSpData?.selectedOptions.includes('prix_total_chauffeur') ? ContratSpData?.selected_offre?.prix_total_chauffeur ?? null : null,
    "Conducteur Additionnel": ContratSpData?.selectedOptions.includes('prix_options_conducteur_add') ? ContratSpData?.selected_offre?.prix_options_conducteur_add ?? null : null,
    "Assurance tous risque": ContratSpData?.selectedOptions.includes('prix_option_assurance') ? ContratSpData?.selected_offre?.prix_option_assurance ?? null : null,
    "Plein carburant": ContratSpData?.selectedOptions.includes('prix_options_plein') ? ContratSpData?.selected_offre?.prix_options_plein ?? null : null,
    "Livraison":  ContratSpData?.selectedOptions.includes('prix_options_livraison') ? ContratSpData?.livraison !== ContratSpData?.selected_offre?.prix_options_livraison ? ContratSpData?.livraison : ContratSpData?.selected_offre?.prix_options_livraison ?? null : null,
    "Rehausseur": ContratSpData?.selectedOptions.includes('prix_options_rehausseur') ? ContratSpData?.selected_offre?.prix_options_rehausseur ?? null : null,
    "Siège bébé": ContratSpData?.selectedOptions.includes('prix_options_siege_bebe') ? ContratSpData?.selected_offre?.prix_options_siege_bebe ?? null : null,
    "Siège enfant": ContratSpData?.selectedOptions.includes('prix_options_siege_enfant') ? ContratSpData?.selected_offre?.prix_options_siege_enfant ?? null : null,
    "Option Wi-Fi": ContratSpData?.selectedOptions.includes('prix_options_wifi') ? ContratSpData?.selected_offre?.prix_options_wifi ?? null : null,
    "Option GPS": ContratSpData?.selectedOptions.includes('prix_options_gps') ? ContratSpData?.selected_offre?.prix_options_gps ?? null : null,
   };

    const totalOptions = Object.values(options).reduce((total, value) => {
      return total + (value || 0);
    }, 0);

    const taarificationdata = {
    prix_par_jour: ContratSpData?.selected_offre?.prix_jour_offre || 0,
    depot_garantie: ContratSpData?.depot_garantie ?? ContratSpData?.selected_offre?.depot_pol ?? 0,
    totale_voiture: ContratSpData?.selected_offre?.prix_total_voiture || 0,
    totale_options: totalOptions,
    totale_facture: (totalOptions + (ContratSpData?.selected_offre?.prix_total_voiture || 0)) - (ContratSpData?.deduction_agence || 0) || 0,
    deduction_agence: ContratSpData?.deduction_agence || 0,
  };

    
   return (
    <div className='w-full h-full flex gap-4 flex-col'>
      {/* Content */}
      <ScrollArea type="auto" className="h-[466px]  pr-3 -mr-3">
        <div className="space-y-6 pr-1">
          { //Header Cards Grid 
          <div className="grid grid-cols-2 gap-6">
            <DetailGeneralCard data={dataGeneral} localDates={true}/>
            <TarificationCard data={taarificationdata} options={options}/>
          </div>}

         {ContratSpData.conducteur && (
            <ConducteurCard data={
              {...ContratSpData.conducteur,
                date_delivrance: ContratSpData?.conducteur?.date_delivrance_cin || null,
                permis: ContratSpData?.conducteur?.permis_conduire}
            } localDates={true}/>
          )}
          {ContratSpData.conducteur_supp && (
          <ConducteurCard data={
            {
              ...ContratSpData.conducteur_supp,
              date_delivrance: ContratSpData?.conducteur_supp?.date_delivrance_cin || null,
              permis: ContratSpData?.conducteur_supp?.permis_conduire,
            }
          } supp={true} localDates={true}/>
          )
          }
          
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pb-0.75 px-0.75 pt-4 border-t">
        <Button 
          type="button"
          variant="outline"
          className="flex items-center gap-2"
          onClick={prev}
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>

        <div className='flex gap-4'>
         {<ApplyDeduction setContratData={setContratSpData} deduction={ContratSpData?.deduction_agence} total = {(totalOptions + (ContratSpData?.selected_offre?.prix_total_voiture || 0))} />}

        <Button 
          onClick={next}
          className="flex items-center gap-2"
          disabled={isPending}
        >
          <Check className="h-4 w-4" />
          Confirmer
        </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmContratSp