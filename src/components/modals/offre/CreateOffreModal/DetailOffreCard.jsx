import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {   CalendarCheck2, MapPin,Info, Handshake, MinusCircle, PlusCircle } from 'lucide-react';
import DetailItem from '../../../customUi/detailitem';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import {FormatDateEEEEddMMyyyy} from '../../../../utils/datautils'


const DetailOffreCard = ({ data }) => {

  return (
    <Card className="shadow-none h-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-medium text-lg">
          <Info className="w-5 h-5" />
          Informations générales
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-x-8 gap-y-5">

          <DetailItem icon={CalendarCheck2} label="Date début">
            {FormatDateEEEEddMMyyyy(data.date_debut_offre)}
          </DetailItem>

          <DetailItem icon={CalendarCheck2} label="Date fin">
            {FormatDateEEEEddMMyyyy(data.date_fin_offre)}
          </DetailItem> 
          
          <DetailItem icon={MinusCircle} label="minimum de jours">
            {data.min_jour_demande_offre || 1}
          </DetailItem>
           <DetailItem icon={PlusCircle} label="maximum de jours">
            {data.max_jour_demande_offre || 'Illimité'}
          </DetailItem>
          <DetailItem icon={MapPin} label="Zones de disponibilité" className="col-span-1 sm:col-span-2">
            {data.gouvernorat_offre.length > 4 ? (
              <TooltipProvider skipDelayDuration={300}>
                <Tooltip delayDuration={700}>
                  <TooltipTrigger asChild>
                    <div className="flex gap-1.5 items-center font-medium">
                      <div className="flex gap-2 items-center w-full flex-wrap">
                        {data.gouvernorat_offre.slice(0, 3).map((item, i) => (
                          <Badge key={i} variant="secondary" className="text-base py-1 leading-none">
                            {item}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-sm w-fit leading-none text-muted-foreground ml-1">
                        +{data.gouvernorat_offre.length - 4} autres
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    avoidCollisions={true}
                    collisionPadding={16}
                    align="center"
                    className="rounded shadow max-w-sm"
                  >
                    <div className="flex flex-wrap gap-2">
                      {data.gouvernorat_offre.map((item, i) => (
                        <Badge key={i} variant="secondary" className="text-sm py-1 leading-none">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <div className="w-full flex flex-wrap items-center gap-2 text-sm sm:text-base font-medium">
                {data.gouvernorat_offre.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-base">
                    {item}
                  </Badge>
                ))}
              </div>
            )}
          </DetailItem>
      </CardContent>
    </Card>
  );
};

export default DetailOffreCard;
