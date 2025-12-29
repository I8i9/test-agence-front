import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Banknote, Car, Settings, Receipt, Info, User2, CalendarCheck2, IdCard, CalendarCog, Phone, House, FolderPen, Calendar, UserCircle2, UserPlus, User, PenLine, Map } from 'lucide-react';
import DetailItem from '../../../customUi/detailitem';
import { formatDateDDMMYYYY, formatDateFrWithouttime } from '../../../../utils/dateConverter';
import ToolTipCustom from '../../../customUi/tooltip';
import { formatDateDDMMYYYYJS , formatDateFrWithouttimeJS} from '../../../../utils/dateConverterJS';
const ConducteurCard = ({ data  ,supp=true , localDates = false}) => {
  if(!data){
    return(null)
  }

  return (
    <Card className="shadow-none h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
            {supp ? <><User/>Conducteur</> :<><UserPlus className="w-5 h-5" />Conducteur supplémentaires</>}
          
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-rows-2 grid-cols-4 gap-x-8 gap-y-9 py-2">
        <DetailItem icon={PenLine} label="Nom & Prénom">
             {data?.nom_prenom}
          </DetailItem>
           <DetailItem icon={Calendar} label="Date de naissance">
                     <ToolTipCustom
            trigger={
                <p className='max-w-fit  truncate'>{localDates ? formatDateDDMMYYYYJS(data?.date_naissance ) || '_' : formatDateDDMMYYYY(data?.date_naissance) || '_'}</p>
            }
            message = {
                localDates ? formatDateFrWithouttimeJS(data?.date_naissance) || '_' :
                formatDateFrWithouttime(data?.date_naissance) || '_'
                }
            />
          
          </DetailItem>

          {
          data?.nationalite && data?.nationalite !== "Tunisienne"  ?
           <DetailItem icon={Map} label="Nationalité">
                  {data?.nationalite || '_'}  
              </DetailItem>

          : null
          }

           <DetailItem icon={IdCard} label="CIN ou Passport">
          {data?.cin_passport}
          </DetailItem>

          
          {
            data?.date_delivrance ?
            <DetailItem icon={CalendarCog} label="Délivrance CIN">
                         <ToolTipCustom
            trigger={
                <p className='max-w-fit  truncate'>{
                    localDates ? formatDateDDMMYYYYJS(data?.date_delivrance) || '_' : formatDateDDMMYYYY(data?.date_delivrance) || '_'
                   }</p>
            }
            message = {
                localDates ? formatDateFrWithouttimeJS(data?.date_delivrance) || '_' : formatDateFrWithouttime(data?.date_delivrance) || '_'
                }
            />
          </DetailItem>
            : null
          }
           
           <DetailItem icon={IdCard} label="Permis">
          {data?.permis}  
          </DetailItem>
           <DetailItem icon={CalendarCog} label="Délivrance Permis">
                           <ToolTipCustom
            trigger={
                <p className='max-w-fit  truncate'>{
                    localDates ? formatDateDDMMYYYYJS(data?.date_delivrance_permis) || '_' : formatDateDDMMYYYY(data?.date_delivrance_permis) || '_'
                   }</p>
            }
            message = {
                 localDates ? formatDateFrWithouttimeJS(data?.date_delivrance_permis) ||  '_' : formatDateFrWithouttime(data?.date_delivrance_permis) ||  '_'
                }
            />
          </DetailItem>
           <DetailItem icon={Phone} label="Téléphone">
          {data?.telephone}
          </DetailItem>
           <DetailItem icon={House} label="Adresse">
                               <ToolTipCustom
            trigger={
                <p className='max-w-fit  truncate'>{data?.adresse || '_'}</p>
            }
            message = {
                data?.adresse
                }
            />
           
          </DetailItem>
      </CardContent>    
    </Card>
  );
};

export default ConducteurCard;
