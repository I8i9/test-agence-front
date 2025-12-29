import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DetailItem from '../../../customUi/detailitem';
import { Button } from '@/components/ui/button';
import { BellRing, CalendarCheck2Icon, CalendarSync, CalendarX2, DollarSign, Folder, HandCoins, RefreshCcw } from 'lucide-react';
import { formatDateDDMMYYYYJS } from '../../../../utils/dateConverterJS';
import { allCosts } from '../../../../utils/costs';
import ToolTipCustom from '../../../customUi/tooltip';

const CreateRappelStep3 = ({ RappelData, prev, next }) => {

  const periods = {
    'HEBDOMADAIRE' : 'Chaque semaine',
    'MENSUEL' : 'Chaque mois',
    'TRIMESTRIEL' : 'Chaque trimestre',
    'SEMESTRIEL' : 'Chaque semestre',
    'ANNUEL' : 'Chaque année'
  }
  return (
    <div className="space-y-6 ">
    <Card className="shadow-none">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 font-medium text-lg">
            <CalendarSync className="w-5 h-5" />
            Informations générales
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className= "grid grid-cols-[30%_40%_30%] gap-y-7 gap-x-6 " >
                <DetailItem label="Premier paiement" icon={CalendarCheck2Icon}>{formatDateDDMMYYYYJS(RappelData.date_debut)}</DetailItem>
                <DetailItem label="Dernier paiement" icon={CalendarX2}>{formatDateDDMMYYYYJS(RappelData.date_fin_rappel)}</DetailItem>
                <DetailItem label="Périodicité" icon={RefreshCcw}>{periods[RappelData.periodicite] || '_'}</DetailItem>
                <DetailItem label="Délai de notification" icon={BellRing}> Avant  {RappelData.delai } jour{RappelData.delai>1 ? 's' : ''}</DetailItem>
                <DetailItem label="Type de Dépense" icon={Folder}>{allCosts.find(cost => cost.value === RappelData.type_depense)?.label}</DetailItem>
                <DetailItem label="Montant de Dépense" icon={DollarSign}>{RappelData.montant_depense ? RappelData.montant_depense + ' DT' : 'Variable' }</DetailItem>
                
             </div>
        </CardContent>
    </Card>
    {/* Navigation buttons */}
      <div className="flex-shrink-0 flex justify-between items-center  pt-4 border-t ">
        <Button 
          variant="outline" 
          onClick={prev}
          className="flex items-center gap-2"
        >
          Retour
        </Button>
        <Button 
          onClick={next}
          className="flex items-center gap-2 bg-rod-primary hover:bg-rod-primary/90"
        >
          Confirmer
        </Button>
      </div>
    </div>
  )
}

export default CreateRappelStep3