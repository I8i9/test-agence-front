import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {Info,CalendarCheck2 ,CalendarX2,MapPinCheck,MapPinX, Gauge, NotebookPen} from 'lucide-react';
import DetailItem from '../../../customUi/detailitem';
import {formatDateDDMMYYYYAHHMM,FormatDateEEEEddMMyyyy} from "../../../../utils/dateConverter.js"
import ToolTipCustom from '../../../customUi/tooltip.jsx'
import { formatDateDDMMYYYYAHHMMJS, FormatDateEEEEddMMyyyyJS } from '../../../../utils/dateConverterJS.js';
const DetailGeneralCard = ({ data , localDates = false }) => {

  return (
    <Card className="shadow-none h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <Info className="w-5 h-5" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-7">
          <DetailItem icon={CalendarCheck2} label="Date départ">
                     <ToolTipCustom
            trigger={
                <p className='max-w-fit'>{
                    localDates ? formatDateDDMMYYYYAHHMMJS(data?.date_depart) || '_' :
                  formatDateDDMMYYYYAHHMM(data?.date_depart) || '_'

                }</p>
            }
            message = {
                localDates ? FormatDateEEEEddMMyyyyJS(data?.date_depart) || '_' :
                FormatDateEEEEddMMyyyy(data?.date_depart) || '_'
                }
            />
          </DetailItem>
               
          <DetailItem icon={CalendarX2} label="Date retour">
               <ToolTipCustom
            trigger={
                <p className='max-w-fit'>{
                    localDates ? formatDateDDMMYYYYAHHMMJS(data?.date_retour) || '_' :
                  formatDateDDMMYYYYAHHMM(data?.date_retour) || '_'
                  
                }</p>
            }
            message = {
                localDates ? FormatDateEEEEddMMyyyyJS(data?.date_retour) || '_' :
                FormatDateEEEEddMMyyyy(data?.date_retour) || '_'
                }
            />
          </DetailItem>

          <DetailItem icon={MapPinCheck} label="Lieu départ" >
          {data?.lieu_depart}
          </DetailItem>
           <DetailItem icon={MapPinX} label="Lieu retour" >
          {data?.lieu_retour}
          </DetailItem>
          <DetailItem icon={Gauge} label="Kilométrage aller">
              {(data?.kilometrage_depart !== null && data?.kilometrage_depart !== undefined) ? data?.kilometrage_depart + ' km' : '_'}
            </DetailItem>
            <DetailItem icon={Gauge} label="Kilométrage retour">
                {(data?.kilometrage_retour !== null && data?.kilometrage_retour !== undefined) ? data?.kilometrage_retour + ' km' : 'illimité'}
            </DetailItem>
          {
            data?.commentaire_contrat &&
            <DetailItem icon={NotebookPen} className={'col-span-full'} label="Observations">
                {data?.commentaire_contrat}
            </DetailItem>
          }
      </CardContent>
    </Card>
  );
};

export default DetailGeneralCard;