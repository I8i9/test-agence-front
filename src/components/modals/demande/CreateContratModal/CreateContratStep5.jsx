import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { differenceInCalendarDays } from 'date-fns';
import TarificationCard from '../../contrat/DetailContratModal/TarificationCard'
import DetailGeneralCard from '../../contrat/DetailContratModal/DetailGeneraleCard'
import ConducteurCard from '../../contrat/DetailContratModal/ConducteurCard';
import { ApplyDeduction } from './ApplyDeduction';
const CreateContratStep5 = ({demande, contratData,setContratData, prev, next,isPending }) => {
  console.log("contratData before transform:", contratData.livraison , demande?.offre?.livraison);

  const calculateRetourKilometrage = () => {
    if( !demande?.offre?.kilometrage_pol) return null;

    const days = differenceInCalendarDays(demande?.date_fin_demande, demande?.date_debut_demande);
    const allowedKilometrage = days * demande?.offre?.kilometrage_pol;
    console.log("allowedKilometrage",demande?.offre?.garage.kilometrage_garage + allowedKilometrage)
    return demande?.offre?.garage.kilometrage_garage + allowedKilometrage;
  };

  // Calculate pricing information
  const prixParJour = (
    demande.prix_total_voiture / differenceInCalendarDays(demande?.date_fin_demande, demande?.date_debut_demande)
  ).toFixed(1).replace(/\.0$/, '');
  const depotGarantie = contratData?.depot_garantie;
  const prixTotal = demande?.prix_total;
  const totalOptions = (demande.prix_total_chauffeur || 0) + (demande.prix_options_gps || 0) + (demande.prix_options_livraison || 0) + (demande.prix_option_assurance || 0) +
   (demande.prix_options_siege_bebe || 0) + (demande.prix_options_siege_enfant || 0) + (demande.prix_options_rehausseur || 0) + (demande.prix_options_plein || 0) + (demande.prix_options_wifi || 0); 
  const prixVoiture = demande.prix_total_voiture;

  const taarificationdata = {
    prix_par_jour: prixParJour || 0,
    depot_garantie: depotGarantie || 0,
    totale_voiture: prixVoiture || 0,
    totale_options: contratData.livraison != demande.prix_options_livraison ? totalOptions + contratData.livraison : totalOptions || 0,
    totale_facture: contratData.livraison != demande.prix_options_livraison ? prixTotal + contratData.livraison - (contratData?.deduction_agence || 0) || 0 : prixTotal - (contratData?.deduction_agence || 0) || 0,
    deduction_agence: contratData?.deduction_agence || 0,
  };

  const options = {
    "Service Chauffeur": demande?.prix_total_chauffeur ?? null,
    "Conducteur Additionnel": demande?.prix_options_conducteur_add,
    "Assurance tous risque": demande?.prix_option_assurance ?? null,
    "Plein carburant": demande?.prix_options_plein ?? null,
    "Livraison": contratData?.livraison || (demande?.prix_options_livraison ?? null),
    "Rehausseur": demande?.prix_options_rehausseur ?? null,
    "Siège bébé": demande?.prix_options_siege_bebe ?? null,
    "Siège enfant": demande?.prix_options_siege_enfant ?? null,
    "Option Wi-Fi": demande?.prix_options_wifi ?? null,
    "Option GPS": demande?.prix_options_gps ?? null,
  };

  const dataConducteur = {
  nom_prenom: contratData?.conducteur_nom_prenom || null,
  date_naissance: contratData?.conducteur_date_naissance || null,
  cin_passport: contratData?.conducteur_cin_passport || null,
  date_delivrance: contratData?.conducteur_date_delivrance_cin || null,
  nationalite: contratData?.conducteur_nationalite || null,
  permis: contratData?.conducteur_permis_conduire || null,
  date_delivrance_permis: contratData?.conducteur_date_delivrance_permis || null,
  telephone: contratData?.conducteur_telephone || null,
  adresse: contratData?.conducteur_adresse || null,
};

const dataConducteurSupp = {
  nom_prenom: contratData?.conducteur_supp_nom_prenom || null,
  date_naissance: contratData?.conducteur_supp_date_naissance || null,
  cin_passport: contratData?.conducteur_supp_cin_passport || null,
  date_delivrance: contratData?.conducteur_supp_date_delivrance_cin || null,
  nationalite: contratData?.conducteur_supp_nationalite || null,
  permis: contratData?.conducteur_supp_permis_conduire || null,
  date_delivrance_permis: contratData?.conducteur_supp_date_delivrance_permis || null,
  telephone: contratData?.conducteur_supp_telephone || null,
  adresse: contratData?.conducteur_supp_adresse || null,
};

  const dataGeneral = {
  numero_contrat: contratData?.numero_contrat || null,
  voiture: {
    nom: demande?.offre?.garage?.nom_voiture || null,
    version: demande?.offre?.garage?.version_voiture || null,
    matricule: demande?.offre?.garage?.matricule_garage || null,
  },
  date_depart: demande?.date_debut_demande || null,
  date_retour: demande?.date_fin_demande || null,
  lieu_depart: demande?.lieu_depart_demande || null,
  lieu_retour: demande?.lieu_retour_demande || null,
  niveau_carburant: contratData?.niveau_carburant || "Sans Niveau",
  kilometrage_depart:  demande?.offre?.garage?.kilometrage_garage || null,
  kilometrage_retour: calculateRetourKilometrage() || null,
};

console.log("dataConducteurAAAAAAAAAAAAAAA",dataConducteur)
const canBeAuto= !contratData.has_conducteur && !contratData.has_conducteur_supplementaire;
  return (
    <div className='w-full h-full flex gap-4 flex-col'>
      {/* Content */}
      <ScrollArea type="auto" className={`${canBeAuto ? "h-auto" : "h-[487px]"}  pr-3 -mr-3`}>
        <div className="space-y-6 pr-1">
          {/* Header Cards Grid */}
          <div className="grid grid-cols-2 gap-6">
            <DetailGeneralCard data={dataGeneral}/>
            <TarificationCard data={taarificationdata} options={options}/>
          </div>

          {/* Conducteur Section */}
          {
            contratData.has_conducteur ?          <ConducteurCard data={dataConducteur} localDates={true}/>
            : null
          }
          {contratData.has_conducteur_supplementaire ? (
          <ConducteurCard data={dataConducteurSupp} supp={true} localDates={true}/>
          ) : null}
        </div>
      </ScrollArea>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-4 border-t">
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
          <ApplyDeduction setContratData={setContratData} deduction={contratData?.deduction_agence} total = {prixTotal} />

        <Button 
          disabled={isPending}
          onClick={next}
          className="flex items-center gap-2"
        >
          <Check className="h-4 w-4" />
          Confirmer
        </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateContratStep5;