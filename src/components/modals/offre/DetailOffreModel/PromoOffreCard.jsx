import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Percent,Icon ,CalendarX2,CalendarCheck2, TicketPercent } from 'lucide-react'
import DetailItem from '../../../customUi/detailitem';
import { Badge } from '../../../ui/badge';
import { targetArrow } from '@lucide/lab';
import { formatDateDDMMYYYY, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';
import ToolTipCustom from '../../../customUi/tooltip';




const stylebadge=(badge)=>{
    let styleClass = '';

    switch (true) {
      // En cours
      case badge === 'Active' :
        styleClass = 'bg-green-100 text-green-600';
        break;
      
      // Planifiée
      case badge === 'Planifiée' || badge.startsWith('Commence'):
        styleClass = 'bg-blue-100 text-blue-600';
        break;

      // Terminée
      case badge === 'Terminée' :
        styleClass = 'bg-red-100 text-red-600';
        break;

      default:
        styleClass = 'bg-gray-100 text-gray-600';
    }
    return styleClass+' px-2 py-1 leading-none text-sm font-semibold'

  }

const promoTypes = {
  PERSONNALISEE: "Personnalisée",
  SOLDES_HIVER: "Soldes Hiver",
  SOLDES_ETE: "Soldes Été",
  RENTREE_SCOLAIRE: "Rentrée Scolaire",
  BLACK_FRIDAY: "Black Friday",
  FIN_ANNEE: "Fin d’Année",
  RAMADHAN: "Ramadhan",
  AID_EL_FITR: "Aïd el-Fitr",
  AID_EL_ADHA: "Aïd el-Adha",
  MOULID_ENNABAOUI: "Moulid Ennabaoui",
};


  
const PromoOffreCard=({data})=>{
    const targetArrowICon = (props) => <Icon iconNode={targetArrow} {...props} />;
  if(!data){
    return(null)
  }
    return(
            <Card className="shadow-none">
                <CardHeader >
                    <CardTitle className="flex items-center gap-2 font-medium text-lg">
                        <div className='flex justify-between w-full'>
                            <div className='flex items-center gap-2'>
                    <Percent className="w-5 h-5" />
                    Promotion 
                    </div>
                    <Badge className={stylebadge(data?.badge)}>Promo {data?.badge}</Badge>
                    </div>
                    </CardTitle>
                    
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 gap-13">   
                         <DetailItem icon={TicketPercent} label='Type de promo'>
                          {promoTypes[data?.type_promo]}
                        </DetailItem>                          
                          <DetailItem label='Date début Promo' icon={CalendarCheck2}>
                            <ToolTipCustom
                              trigger={<p className=" max-w-fit  truncate">{formatDateDDMMYYYY(data?.date_debut_promo)}</p>}
                              message={FormatDateEEEEddMMyyyy(data?.date_debut_promo)}
                            />
                        </DetailItem>  
                            <DetailItem label='Date fin Promo' icon={CalendarX2}>
                            <ToolTipCustom
                              trigger={<p className=" max-w-fit  truncate">{formatDateDDMMYYYY(data?.date_fin_promo)}</p>}
                              message={FormatDateEEEEddMMyyyy(data?.date_fin_promo)}
                            />
                        </DetailItem>
                           <DetailItem icon={targetArrowICon} label='taux de promotion'>
                        {data.taux_promo}%
                        </DetailItem>                                                                             
                    </div>
                </CardContent>
            </Card>
    )
}
export default PromoOffreCard