import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Banknote, Car, Settings, Receipt, Info, Key, Tag, BanknoteArrowDown } from 'lucide-react';
import DetailItem from '../../../customUi/detailitem';
import { Separator } from '@/components/ui/separator';
import ToolTipCustom from '../../../customUi/tooltip';


const TarificationCard = ({badge , penalite, data  ,options , numberOptions }) => {
  console.log("options",options)
  return (
    <Card className="shadow-none h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <DollarSign className="w-5 h-5" />
            Tarification 
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-7">
        <DetailItem label="Prix par jour" icon={DollarSign}>
          {data?.prix_par_jour!==null ? `${data?.prix_par_jour} DT` : '_'}
        </DetailItem>

        <DetailItem label={<ToolTipCustom trigger={<span className='flex items-start'>Caution Effective<Info className="size-3 ml-1 text-gray-500" /></span>} message={
        <div class=" bg-gray-50 text-sm leading-relaxed">
  
  Le Montant réellement déposé par le client pour ce contrat.
  <br />
  Elle peut différer de la caution proposée dans l’offre.
</div>} />} icon={Banknote}>
          {data?.depot_garantie!=null ? data?.depot_garantie===0 ? 'Sans Caution' : `${data?.depot_garantie} DT` : 'Sans Caution'}
        </DetailItem>

        <DetailItem label="Totale de voiture" icon={Car}>
          {data?.totale_voiture!==null ? `${data?.totale_voiture} DT` : '_'}
        </DetailItem>
     <DetailItem label="Totale des options" icon={Settings}>
      <ToolTipCustom
        trigger={
          <span className="flex items-start gap-1">
            {data?.totale_options!== null && data?.totale_options!== undefined ? <> {`${data?.totale_options} DT`}<Info className="w-3 h-3 text-gray-600" /></> : 'Sans options' }
            
          </span>
        }
        message={
          // eslint-disable-next-line no-unused-vars
          data?.totale_options  === null ||     Object.entries(options)?.every(([key, value]) => (value === null || value === undefined)) ? (
            "Aucune option ajoutée"
          ) : (
            <div className="space-y-1 w-56">
              {/* eslint-disable-next-line no-unused-vars */}
              {Object.entries(options).map(([key, label]) => {
                const value = options?.[key] ??  null
                console.log(value)
                const showNumber = numberOptions?.[key]
                if (value === null) return null
                return (
                  <div key={key}>
                    <p className=" justify-between font-normal h-6 flex items-center">
                      <span className=" text-gray-600 font-normal">
                        {showNumber ? `${showNumber} ` : ''}{key}
                        
                      </span>
                      {value === 0 ? `Gratuit` : `${value} DT`}
                    </p>
                    <Separator />
                  </div>
                )
              })}

              <p className=" justify-between font-semibold h-6 flex items-center">
                <span className="font-medium">Totale des Options</span>
                {`${data?.totale_options} DT`}
              </p>
            </div>
          ) 
        }
      />
    </DetailItem>

        {
          data?.deduction_agence ?
            <DetailItem label="Remise Agence" icon={BanknoteArrowDown}>
            {data?.deduction_agence ? <span className="font-semibold">-{data?.deduction_agence} DT</span> : '_'}
            </DetailItem>
            : null
        }
        
        <DetailItem label="Totale Facture" icon={Receipt}>
          {data?.totale_facture!==null ? 
          badge === 'Annulé' ?
          <ToolTipCustom
            trigger={
          <span className="font-semibold flex"> <span className=' text-gray-500 line-through decoration-1.5  mr-2 font-normal'>{data?.totale_facture} DT</span> {penalite || 0} DT <Info className="w-3 h-3 ml-1 place-self-start text-gray-600" /></span>}
          message={
                'Suite à l’annulation du contrat, la facture totale devient la pénalité appliquée. ' 
            }
          />
          : <span className="font-semibold">{data?.totale_facture} DT</span> 
          : '_'}
        </DetailItem>
      </CardContent>


    </Card>
  );
};

export default TarificationCard;
