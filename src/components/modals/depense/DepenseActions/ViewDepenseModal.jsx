import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
} from '@/components/ui/dialog';
import {Gauge, Loader2, Building2 } from 'lucide-react';
import { useFetchDetailDepense } from '../../../../api/queries/depense/useFetchDepenseDetail';

import {Separator} from "@/components/ui/separator";
import {Badge} from "@/components/ui/badge";
import ToolTipCustom from '../../../customUi/tooltip';
import { useState } from 'react';
import Information from './information';
import Compta from './compta';



export const ViewDepenseModal = ({open, data, close }) => {
    const {data: DepenseData , isLoading , isError} = useFetchDetailDepense(data.id , {enabled: open});

      const statusConfig = {
              PAYE: { label: 'Payé', className: 'bg-green-100 text-green-600' },
              PARTIELLE: { label: 'Partielle', className: 'bg-yellow-100 text-yellow-600' },
              NON_PAYE: { label: 'Non payé', className: 'bg-red-100 text-red-600' }
        };

    
    const [maximizedFacture, setMaximizedFacture] = useState(null);


    return (
        <>
        <Dialog open={open} onOpenChange={(newOpenState) => {
                    // Only close the modal if the new state is 'false' (it's trying to close)
                    // AND the maximizedFacture is NOT open.
                    if (newOpenState === false && !maximizedFacture?.url) {
                        close();
                    }
                    // If newOpenState is true (it's trying to open, which shouldn't happen here) or
                    // if newOpenState is false BUT the image is maximized, we block the close.
                    // This prevents the main dialog from closing when clicking the maximized image viewer's overlay.
                }}>
            <DialogContent className={`scale-85 desktop:scale-90 desktop-lg:scale-110 flex flex-col ${isLoading ? 'h-[605px] w-[900px]' : 'h-auto w-[900px] '}`}>
                <DialogHeader className="h-fit">
                    <DialogTitle>Dépense {data.sequence}</DialogTitle>
                    <DialogDescription>
                        Consultez les informations relatives à cette dépense
                    </DialogDescription>
                    <Separator />
                </DialogHeader>

                 {!isLoading && !isError && (
                    <>
                        
                            <div className='flex justify-between w-full  px-2'>
                                <div className="flex items-center justify-start gap-3 ">
                                 {DepenseData.garage ? (
                                    <div className="flex items-center justify-start gap-3 ">
                                    <Badge variant="outline"  className=' px-2 py-1 leading-none text-sm  font-semibold'> {DepenseData.garage.nom_voiture} </Badge>
                                    <Badge variant="outline"  className='px-2 py-1 leading-none text-sm  font-semibold'> {DepenseData.garage.matricule_garage} </Badge>
                                    <ToolTipCustom
                                    trigger={<Badge variant="outline" className='px-2 py-1 cursor-pointer leading-none text-sm font-semibold [&>svg]:size-4 h-full '><Gauge className='mb-0.5' /> <span className='leading-none'>{DepenseData.kilometrage_depense || 0} Km </span> </Badge>}
                                    message={<><span>Kilométrage au moment de la dépense :</span> <span className='font-semibold'> {DepenseData.kilometrage_depense || 0} Km </span></>}
                                />
                                </div>
                                ) :
                                (
                                    <Badge variant="outline"  className=' px-2 py-1 leading-none text-sm  font-semibold'><Building2 className='mb-0.5'/> Dépense liée à l'agence </Badge>
                                )
                            
                            }
                                
                                </div>  
                                
                                <Badge variant="default" className={"px-2 py-1 leading-none text-sm  font-semibold "+statusConfig[DepenseData.status_depense].className}> 
                                    {statusConfig[DepenseData.status_depense].label}
                                </Badge>
                                
                            </div> 
                    </>
                )}

                {
                    isLoading ? (
                        <div className='flex-1  w-full flex justify-center items-center mb-4'>
                            <Loader2 className='animate-spin'/>
                        </div>
                    ) : isError ? (
                        <div className='text-destructive  w-full flex justify-center mb-4'>
                            Erreur lors du chargement de détails de la dépense
                        </div>
                    ) : (
                        <div className='flex flex-col gap-4'>

                        <Information DepenseData={DepenseData} maximizedFacture={maximizedFacture} setMaximizedFacture={setMaximizedFacture}  />
                        <Compta DepenseData={DepenseData} />


                       

                        </div>
                       
                    )
                }
               

            </DialogContent>

        </Dialog>
        
           
        </>
    );
};
