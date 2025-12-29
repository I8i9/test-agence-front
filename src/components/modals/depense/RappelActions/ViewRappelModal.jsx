import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFetchDetailRappel } from '../../../../api/queries/depense/rappel/useFetchRappelDetail';
import { CalendarDaysIcon, Folder , DollarSign,NotebookText, Loader2, CalendarCheck2, CalendarX2, BellRing, RefreshCcw, Pin, CalendarClockIcon, CalendarFold, } from 'lucide-react';
import { formatDateDDMMYYYY, FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';

import { allCosts } from '../../../../utils/costs';
import DetailItem  from '../../../customUi/detailitem';
import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import ToolTipCustom from '../../../customUi/tooltip';


export const ViewRappelModal = ({open, data, close }) => {
    const {data: RappelData , isLoading , isError} = useFetchDetailRappel(data.id , {enabled: open});
    console.log('rappel data', RappelData);
    const labels = {
              HEBDOMADAIRE : "Chaque semaine" ,
              MENSUEL :  "Chaque mois"  ,
              TRIMESTRIEL :  "Chaque trimestre",
              SEMESTRIEL :  "Chaque semestre" ,
              ANNUEL :  "Chaque année" 
    }
    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className={`w-[900px] ${isLoading ? 'h-[450px]' : 'h-fit'}`}>
                <DialogHeader className="h-fit">
                    <DialogTitle>Rappel {data.sequence}</DialogTitle>
                    <DialogDescription>
                        Consultez les informations relatives à cette dépense
                    </DialogDescription>
                    <Separator />
                </DialogHeader>

                 {
                    (!isLoading && !isError) && (
                    RappelData.garage && (
                        <div className='flex justify-between  px-2'>
                            <div className="flex items-center justify-start gap-3 ">
                                
                                <Badge variant="outline"  className='  px-2 py-1 leading-none text-sm  font-semibold'> {RappelData.garage.nom_voiture} </Badge>
                                <Badge variant="outline"  className='  px-2 py-1 leading-none text-sm  font-semibold'> {RappelData.garage.matricule_garage} </Badge>
                            </div>   
                        </div>
                        )
                    )
                }

                {
                    isLoading ? (
                        <div className='  w-full flex justify-center mb-4'>
                            <Loader2 className='animate-spin'/>
                        </div>
                    ) : isError ? (
                        <div className='text-destructive  w-full flex justify-center mb-4'>
                            Erreur lors du chargement de détails de la dépense
                        </div>
                    ) : (
                         <Card className="shadow-none">
                            <CardContent>
                                <div className= "grid grid-cols-3 gap-y-7 gap-x-12 " >
                                    <DetailItem label="Date du premier paiement" icon={CalendarCheck2}>
                                         <ToolTipCustom trigger={<span>{formatDateDDMMYYYY(RappelData.date_debut_rappel) }</span>} message={FormatDateEEEEddMMyyyy(RappelData.date_debut_rappel)} />
                                    </DetailItem>
                                    <DetailItem label="Date de dernier paiement" icon={CalendarX2}>
                                        <ToolTipCustom trigger={<span>{formatDateDDMMYYYY(RappelData.date_fin_rappel) }</span>} message={FormatDateEEEEddMMyyyy(RappelData.date_fin_rappel)} />
                                    </DetailItem>
                                    <DetailItem label="Périodicité" icon={RefreshCcw}>{labels[RappelData.periodicite_rappel]}</DetailItem>
                                    <DetailItem label="Type de dépense" icon={Folder}>{allCosts.find(cost => cost.value === RappelData.type_depense_rappel)?.label}</DetailItem>
                                    <DetailItem label="Montant" icon={DollarSign}>{RappelData.montant_rappel ? RappelData.montant_rappel + ' DT' : 'Variable'}</DetailItem>
                                    <DetailItem label="Délai de notification" icon={BellRing}>{RappelData.delai_rappel + " Jour" + (RappelData.delai_rappel > 1 ? 's' : '')}</DetailItem>
                                    <DetailItem label="Dernière échéance" icon={CalendarClockIcon}>
                                        {RappelData.last_confirmation ? (
                                            <ToolTipCustom trigger={<span>{formatDateDDMMYYYY(RappelData.last_confirmation)}</span>} message={FormatDateEEEEddMMyyyy(RappelData.last_confirmation)} />
                                        ) : (
                                            'Aucun paiement effectué'
                                        )}
                                    </DetailItem>

                                    <DetailItem label="Prochaine échéance" icon={CalendarFold}>
                                        {RappelData.date_rappel ? (
                                            <ToolTipCustom trigger={<span>{formatDateDDMMYYYY(RappelData.date_rappel)}</span>} message={FormatDateEEEEddMMyyyy(RappelData.date_rappel)} />
                                        ) : (
                                            'Aucun paiement effectué'
                                        )}
                                    </DetailItem>

                                    <DetailItem label="Paiements effectués " icon={Pin}>{<span className="font-semibold ">{RappelData.occuredReminders}</span>} / { <span className="font-semibold ">{RappelData.upcomingReminders+RappelData.occuredReminders}</span>}
                                    </DetailItem>

                                </div>
                            </CardContent>
                        </Card>
                    )
                }
               

            </DialogContent>
        </Dialog>
    );
};
