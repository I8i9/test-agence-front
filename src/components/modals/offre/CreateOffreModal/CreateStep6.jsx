import { Button } from '@/components/ui/button';
import DetailOffreCard from './DetailOffreCard'
import TarificationOffreCard from './TarificationCard'
import PolitiquesOffreCard from './PolitiqueOffreCard';
import OptionsOffreCard from './OptionsOffreCard';

// Data preparation functions 
const prepareDetailData = (offreData) => {
  return {
    date_debut_offre: offreData.date_debut_offre?.toISOString(),
    date_fin_offre: offreData.date_fin_offre?.toISOString(),
    min_jour_demande_offre: offreData.min_jour_demande_offre,
    max_jour_demande_offre: offreData.max_jour_demande_offre,
    gouvernorat_offre: offreData.gouvernorat_offre
  };
};

const prepareTarificationData = (offreData) => {
  return {
    prix_jour_offre: offreData.prix_jour_offre || offreData.prix_jour,
    depot_pol: offreData.depot_pol,
    avec_prix_dynamique: offreData.avec_prix_dynamique,
    prix_dynamique_offre: offreData.avec_prix_dynamique ? 
      offreData.prix_dynamique_offre?.reduce((acc, option) => {
        if (option.days && option.price) {
          acc[option.days] = parseFloat(option.price);
        }
        return acc;
      }, {}) : null, 
    promo: offreData.promo || null
  };
};

const preparePolitiquesData = (offreData) => {
  return {
    carburant_pol: offreData.carburant_pol === "MEME_NIVEAU" ? "MÊME_NIVEAU" : offreData.carburant_pol,
    assurance_pol: offreData.assurance_pol,
    conducteur_pol: offreData.conducteur_pol,
    kilometrage_pol_offre: offreData.kilometrage_limite ? 
      parseFloat(offreData.kilometrage_pol) : 0,
    annulation_pol_offre: offreData.has_cancellation_fee ? 
      parseFloat(offreData.annulation_pol) : null,
    modification_pol_offre: offreData.has_modification_fee ? 
      parseFloat(offreData.modification_pol) : null,
    anciennite_permis_pol: parseFloat(offreData.anciennite_permis_pol) || 0,
    age: parseFloat(offreData.age) || 0,
    livraison_pol: offreData.livraison_pol || "AGENCE",
    type_penalite: offreData.type_penalite ,
    montant_penalite:offreData.montant_penalite,
  };
};



const CreateStep6 = ({ offreData, prev, next , isPending}) => {
  console.log('Offre Data in Step 6:', offreData);
  // Prepare data for each card component 
  const detailData = prepareDetailData(offreData);
  const tarificationData = prepareTarificationData(offreData);
  const politiquesData = preparePolitiquesData(offreData);
  const optionsData = (offreData?.selectedOptions || {});
  return (
    <div className="flex flex-col h-full">
      <div className="overflow-y-auto space-y-4 pb-4 grid-rows-2 no-scrollbar">
        <div className='grid grid-cols-2 gap-4'>
          <DetailOffreCard data={detailData} />
          <TarificationOffreCard data={tarificationData} />
        </div>
        <PolitiquesOffreCard data={politiquesData} /> 
        {
          Object.keys(optionsData).length > 0 && <OptionsOffreCard optionsData={optionsData} />

        }
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={prev} className="rounded-sm">
          Retour
        </Button>
        <Button disabled={isPending} onClick={next} className="rounded-sm">
          Confirmer
        </Button>
      </div>
    </div>
  )
}

export default CreateStep6;