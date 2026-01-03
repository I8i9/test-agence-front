import { CreditCard, Loader2, RefreshCw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFetchFleetCount } from '../../api/queries/garage/useFetchFleetCount';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger , DialogFooter,DialogClose } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import logo from '../../assets/logos/rod_logo_rounded.svg'
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import {abonnementPlans} from '../../utils/abonnement.js'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {  addMonths, addYears } from 'date-fns';
import { Card, CardContent , CardHeader , CardTitle,CardDescription,CardAction } from '@/components/ui/card';
import { Checkbox } from '../../components/customUi/animatedCheckbox.jsx';
import useAddSubscription from '../../api/queries/subscription/addSubscription.js';
import { Slider } from '@/components/ui/slider';



const ExpiredPage = () => {
  const {data, isLoading, isError} = useFetchFleetCount();
  const [slider, setSlider] = useState([data?.count]);
  const {mutate , isPending} = useAddSubscription();
  const [selectedType, setSelectedType] = useState(abonnementPlans[0]?.key);
  const [checked , setChecked] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = useState(false);
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSlider([data.count]);
      }, 300);
    }
  }, [data, open]);
  const getNextDate = (selectedType) => {
    const currentDate = new Date();
    let nextDate = currentDate;
    switch (selectedType) {
      case 'one_month':
        nextDate = addMonths(currentDate, 1);
        break;
      case 'three_month':
        nextDate = addMonths(currentDate, 3);
        break;
      case 'six_month':
        nextDate = addMonths(currentDate, 6);
        break;
      case 'one_year':
        nextDate = addYears(currentDate, 1);
        break;
      default:

        break;
    }
    return nextDate;
  };

  const getInvoices = (selectedType) => {
    switch (selectedType) {
      case 'one_month':
        return 1;
      case 'three_month':
        return 3;
      case 'six_month':
        return 6;
      case 'one_year':
        return 12;
      default:
        return null;   
    }
  };
  const handleRenewSubscription = () => {
    const subscriptionData = {
      period_abonnement: selectedType,
    };
    mutate(subscriptionData);
  }


  function formatFrenchDate(date) {
      const d = new Date(date);
      const day = d.getDate();
      
      const monthYear = new Intl.DateTimeFormat("fr-FR", {
        month: "long",
        year: "numeric"
      }).format(d);

      

      const dayPart = day === 1 ? "1er" : day;

      return `${dayPart} ${monthYear}`;
    }

  return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className='w-full h-fit flex flex-col items-center justify-center space-y-2 -mt-[9vh]'>
          <div className="laptop:h-12 desktop:h-12 desktop-lg:h-16  desktop-xl:h-16 laptop:w-12 desktop:w-12 desktop-lg:w-16 desktop-xl:w-16  h-16  w-16  bg-red-200 flex items-center justify-center rounded-xl">
                <TriangleAlert className='text-rod-accent laptop:h-8 desktop:h-8 desktop-lg:h-10  desktop-xl:h-10 laptop:w-8 desktop:w-8 desktop-lg:w-10 desktop-xl:w-10' />
          </div>
          <h3 className="laptop:text-xl desktop:text-xl  desktop-lg:text-2xl desktop-xl:text-2xl text-xl font-semibold mt-2">Abonnement expiré</h3>
          <p className="laptop:text-lg desktop:text-lg desktop-lg:text-xl desktop-xl:text-xl text-lg text-gray-500 text-center max-w-[720px]">
            Votre abonnement a expiré et l'accès aux fonctionnalités a été suspendu. Renouvelez votre abonnement pour continuer à profiter de tous les avantages.
          </p>

          {/* mpodal for requesting upgrade */}
          <Dialog open={open} onOpenChange={setOpen} modal> 
            <DialogTrigger asChild> 
          <Button className="laptop:mt-2 desktop:mt-2 desktop-lg:mt-4 desktop-xl:mt-4"> <RefreshCw /> Renouveler l'abonnement</Button>
            </DialogTrigger>

            <DialogContent className={`flex max-w-[650px] h-[548px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col `}>
              
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="w-full leading-tight flex text-xl items-center gap-3"> 
                  <img src={logo} alt="Rod logo" className='size-10' />
                  Renouveler l'abonnement Rod
                </DialogTitle>
                <DialogDescription className='leading-tight text-base -mt-2'>
                 Choisissez la durée. Le renouvellement démarre immédiatement.
                </DialogDescription>
                
                <Separator />
            </DialogHeader>


                {
                isLoading ?
                   <div className='w-full h-full flex items-center justify-center '>
                      <Loader2 className='animate-spin' />
                   </div>
              
                :
                isError ?
                   <div className='w-full h-full text-destructive flex items-center justify-center '>
                      Une erreur est survenue. Veuillez rafraîchir et réessayer plus tard.
                   </div>
                  :
                <>
                <div className='flex flex-col gap-4'>
                  <div >
                    <Label className=' mt-4'>Période d'abonnement</Label>
                    <Select value={selectedType} onValueChange={setSelectedType}>
                        <SelectTrigger className="w-full mt-2 ">
                          <SelectValue placeholder="Choisir la période abonnement" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {abonnementPlans.map(plan => (
                            <SelectItem key={plan.key} value={plan.key}>{plan.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <span className=' flex items-center mt-3 ml-1 text-sm text-muted-foreground'>
                      <CreditCard className='inline mr-2 mb-0.5 size-5' /> Votre nouvel abonnement sera actif jusqu’au   <span className='font-semibold ml-1.5'>{formatFrenchDate(getNextDate(selectedType))}</span>
                    </span>
                  </div>

                  <Card className='shadow-none mt-2 ' >
                    <CardHeader>
                      <CardTitle>Estimation des coûts ({getInvoices(selectedType)} facture{getInvoices(selectedType) > 1 ? 's' : ''})</CardTitle>
                      <CardDescription>{data?.prix} DT par voiture louée au moins une fois dans le mois.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='flex-col flex gap-3  '>
                        
                          <Slider value={slider} onValueChange={setSlider} max={300} min={0} className="w-full "  />
                          <div className='flex justify-between  w-full text-base font-semibold'>
                              <span >{slider[0]} véhicules</span>
                              <span >{slider[0] * data?.prix } TTC<span className='text-sm font-medium text-gray-700'> /facture</span></span>

                          </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className='flex items-center ml-2 mb-4 '>
                    <Checkbox id="conditions" checked={checked} onCheckedChange={setChecked} className={'mb-0.5 data-[state=checked]:bg-rod-accent data-[state=checked]:border-rod-accent focus-visible:ring-rod-accent/30 '} />
                    <Label htmlFor="conditions" className='ml-2 text-base cursor-pointer'>J’accepte <Button onClick={() => setOpenModal(true)} variant='link' className='text-rod-accent text-base py-0 px-0 !mx-0'>l’accord d’abonnement</Button> et <Button onClick={() => setOpenModal(true)} variant='link' className='text-rod-accent text-base py-0 px-0 '>les conditions d’utilisation.</Button>  </Label>
                  </div>
                </div>
                
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>Plus tard</Button>
                </DialogClose>
                <Button disabled={!checked || isPending} onClick={handleRenewSubscription} type='submit'>
                  {
                    isPending ? <><Loader2 /> En cours...</> : 
                  
                  <><RefreshCw /> Renouveler</> }
                  </Button>
              </DialogFooter>
            </>

          }
          </DialogContent>

            

      
          </Dialog>

          {
            <Dialog open={openModal} onOpenChange={setOpenModal} modal> 

            <DialogContent className={`flex max-w-[650px] h-auto scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col `}>
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="w-full leading-tight flex text-xl items-center gap-3"> 
                  <img src={logo} alt="Rod logo" className='size-10' />
                  Renouveler l'abonnement Rod
                </DialogTitle>
                <DialogDescription className='leading-tight text-base -mt-2'>
                  Veuillez sélectionner le forfait qui vous convient. Votre nouvel abonnement sera activé immédiatement.
                </DialogDescription>
              </DialogHeader>

                
                <Separator />

                <div className='flex flex-col gap-4'>
                  dazdazdaz
                </div>
                
            </DialogContent>
          </Dialog>
          }
        </div>
    </div>
  )
}

export default ExpiredPage