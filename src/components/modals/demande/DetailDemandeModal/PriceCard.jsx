import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';


const PriceCard = ( {prices}) => { 
  console.log("pricesZZZZZZZZZZZZZZZZZZZ",prices);
    return (
        <Card className="shadow-none w-full gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <Calculator className="w-5 h-5" />
          Détail du Prix
        </CardTitle>
      </CardHeader>
      <CardContent className='h-full flex flex-col  justify-between'> 
        <div className='h-[140px] overflow-y-auto   flex flex-col  pr-4 -mr-4'>
          <div className='w-full flex justify-between items-center text-base mb-1'>
            <span className='font-normal text-gray-800'>
              { prices.numberOfDays + ' Jour' + (prices.numberOfDays > 1 ? 's' : '')} x {prices.prix_journalier_effectif} DT
            </span>
            <span className='font-medium '>
              {prices.prix_total_voiture} DT
            </span>
          </div>

          {
            // conducteur additionnel
             prices.prix_options_conducteur_add !== null && prices.prix_options_conducteur_add >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
               Conducteur additionnel
              </span>
              <span className='font-medium'>
                {prices.prix_options_conducteur_add > 0 ? prices.prix_options_conducteur_add + " DT" : "Gratuit"}
              </span>
            </div>
          }
          { // chauffeur
            prices.prix_total_chauffeur !== null && prices.prix_total_chauffeur > 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
               Service Chauffeur
              </span>
              <span className='font-medium'>
                { prices.prix_total_chauffeur + " DT"}
              </span>
            </div>    
          }

         

          { // option assurance
            prices.prix_options_assurance_TR !== null && prices.prix_options_assurance_TR >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
               Assurance tous risque
              </span>
              <span className='font-medium'>
                {prices.prix_options_assurance_TR ? prices.prix_options_assurance_TR + " DT" : "Gratuit"} 
              </span>
            </div>    
          }

          { // option assurance
            prices.prix_options_assurance_PR !== null && prices.prix_options_assurance_PR >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
               Assurance tous risque
              </span>
              <span className='font-medium'>
                {prices.prix_options_assurance_PR ? prices.prix_options_assurance_PR + " DT" : "Gratuit"}
              </span>
            </div>    
          }

          { // option plein carburant            
              prices.prix_options_plein !== null && prices.prix_options_plein >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                Plein carburant
              </span>
              <span className='font-medium'>
                { prices.prix_options_plein ? prices.prix_options_plein + " DT" : "Gratuit"}
              </span>
            </div>    
          }

          { // option livraison           
            prices.prix_options_livraison !== null && prices.prix_options_livraison >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                Livraison au client
              </span>
              <span className='font-medium'>
                { prices.prix_options_livraison ? prices.prix_options_livraison + " DT" : prices.offre.livraison === "FREE" ? "Gratuit" : "À négocier"}
              </span>
            </div>    
          }

          { // option rehausseur
            prices.prix_options_rehausseur !== null && prices.prix_options_rehausseur >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                 Réhausseur {prices.nbre_options_rehausseur > 1 && `×${prices.nbre_options_rehausseur}`}
              </span>
              <span className='font-medium'>
              { prices.prix_options_rehausseur ? prices.prix_options_rehausseur + " DT" : "Gratuit"}
              </span>
            </div>    
          }

          { // option rehausseur
            prices.prix_options_siege_bebe !== null && prices.prix_options_siege_bebe >= 0 &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                 Siège bébé {prices.nbre_options_siege_bebe > 1 && `×${prices.nbre_options_siege_bebe}`}
              </span>
              <span className='font-medium'>
              { prices.prix_options_siege_bebe ? prices.prix_options_siege_bebe + " DT" : "Gratuit"}
              </span>
            </div>    
          }

          { // option rehausseur
            (prices.prix_options_siege_enfant !== null && prices.prix_options_siege_enfant >= 0) &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                 Siège enfant {prices.nbre_options_siege_enfant > 1 && `×${prices.nbre_options_siege_enfant}`}
              </span>
              <span className='font-medium'>
              { prices.prix_options_siege_enfant ? prices.prix_options_siege_enfant + " DT" : "Gratuit"}
              </span>
            </div>    
          }

          { // option wifi            
           (prices.prix_options_wifi !== null && prices.prix_options_wifi >= 0) ? 
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                 Option Wi-Fi
              </span>
              <span className='font-medium'>
              {prices.prix_options_wifi > 0 ? prices.prix_options_wifi + " DT" : "Gratuit"}
              </span>
            </div>
            : 
            null
          }

          { // option gps            
            (prices.prix_options_gps !== null && prices.prix_options_gps >= 0) &&
            <div className='w-full flex justify-between items-center text-base mb-1'>
              <span className='font-normal text-gray-800'>
                 Option GPS
              </span>
              <span className='font-medium'>
                {prices.prix_option_gps ? prices.prix_option_gps + " DT" : "Gratuit"}
              </span>
            </div>    
          }



          

        </div>
        <div className='space-y-3'>
          <Separator />
          <div className='flex justify-between items-baseline w-full text-base'>
            <span className='font-medium'>
              Montant Totale
            </span>
            <span className='font-semibold'>
              {prices.prix_total} DT
            </span>
          </div>
        </div>
      </CardContent>
     
    </Card>
    );
};
export default PriceCard