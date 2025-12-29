import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {  formatDateDDMMYYYYAHHMM, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';
import ToolTipCustom from '../../../customUi/tooltip';
import { formatDateDDMMYYYY } from '../../../../utils/dateConverter';
import   DetailItem from '../../../customUi/detailitem';

import { CalendarCheck, CalendarDays, CalendarX, DollarSign, Handshake, MapPinCheck, MapPinX } from 'lucide-react';
const DetailsCard = ({demande}) => {
    return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <Handshake className="w-5 h-5" />
          Détails de Demande
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-7">
        {/* demand Details Grid */}
          {/* date creation */}
          <DetailItem label="Reçue le" icon={CalendarDays}>
            <ToolTipCustom
            trigger={
                <p className='max-w-fit  truncate'>{formatDateDDMMYYYY(demande?.date_creation_demande) || 'N/A'}</p>
            }
            message = {
                FormatDateEEEEddMMyyyy(demande?.date_creation_demande) || 'N/A'
                }
            />
            </DetailItem>
            

           {/* montant totale */}
          <DetailItem label="Montant totale" icon={DollarSign}>
             <p className=" flex max-w-fit  items-start gap-1 truncate">{demande?.prix_total + ' DT' || 'N/A'} {/*<Info className='w-3 h-3  text-gray-600'/>*/} </p>
            
          </DetailItem>  

          {/* lieu depart */}
          <DetailItem label="Lieu départ" icon={MapPinCheck}>
            <ToolTipCustom
              trigger={
                <p className="max-w-fit truncate">{demande?.lieu_depart_demande || 'N/A'}</p>
              }
              message={demande?.lieu_depart_demande || 'N/A'}
            />
          </DetailItem>

            {/* lieu retour */}
          <DetailItem label="Lieu retour" icon={MapPinX}>
            <ToolTipCustom
              trigger={
                <p className=" max-w-fit  truncate">{demande?.lieu_retour_demande || 'N/A'}</p>
              }
              message={demande?.lieu_retour_demande || 'N/A'}
            />
          </DetailItem>   

          {/* date depart */}
          <DetailItem label="Date départ" icon={CalendarCheck}>
            <ToolTipCustom
              trigger={
                <p className=" max-w-fit  truncate">{formatDateDDMMYYYYAHHMM(demande?.date_debut_demande) || 'N/A'}</p>
              }
              message={FormatDateEEEEddMMyyyy(demande?.date_debut_demande) || 'N/A'}
            />
          </DetailItem>

            {/* date retour */}
          <DetailItem label="Date retour" icon={CalendarX}>
            <ToolTipCustom
              trigger={
                <p className=" max-w-fit  truncate">{formatDateDDMMYYYYAHHMM(demande?.date_fin_demande) || 'N/A'}</p>
              }
              message={FormatDateEEEEddMMyyyy(demande?.date_fin_demande) || 'N/A'}
            />
          </DetailItem>
      </CardContent>
    </Card>
    )
}

export default DetailsCard