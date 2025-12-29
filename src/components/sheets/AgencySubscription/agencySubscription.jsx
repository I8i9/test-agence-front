import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,

} from "@/components/ui/sheet"
import { Shield,Crown,X,  Calendar, FileText, Hash} from 'lucide-react'

import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAgencySubscription } from '../../../api/queries/subscription/subscriptionQuery'
import {
  Card,
  CardContent,

  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import AgencySubscriptionSkeleton from './agencySubscription.skeleton'
import { FormatDateEEEEddMMyyyy , FormatDateddMMyyyy, formatDateDDMMYYYY } from "../../../utils/dateConverter"

const test = [
    {
      reference_facture: "INV-2025-001",
      date_facture: "2025-01-05",
      date_echeance: "2025-01-15",
      number_of_cars: 3,
      price_per_car: 120,
      total_ht: 360,
      total_ttc: 414,
    },
    {
      reference_facture: "INV-2025-002",
      date_facture: "2025-01-10",
      date_echeance: "2025-01-20",
      number_of_cars: 5,
      price_per_car: 110,
      total_ht: 550,
      total_ttc: 632.5,
    },
    {
      reference_facture: "INV-2025-003",
      date_facture: "2025-01-14",
      date_echeance: "2025-01-24",
      number_of_cars: 2,
      price_per_car: 150,
      total_ht: 300,
      total_ttc: 345,
    },
    {
      reference_facture: "INV-2025-004",
      date_facture: "2025-01-18",
      date_echeance: "2025-01-28",
      number_of_cars: 4,
      price_per_car: 130,
      total_ht: 520,
      total_ttc: 598,
    },
    {
      reference_facture: "INV-2025-005",
      date_facture: "2025-01-22",
      date_echeance: "2025-02-01",
      number_of_cars: 6,
      price_per_car: 105,
      total_ht: 630,
      total_ttc: 724.5,
    },
  ]

const period = {
  '1 mois' : 'bg-orange-100 text-orange-500',
  '3 mois' : 'bg-purple-100 text-purple-500',
  '6 mois' : 'bg-indigo-100 text-indigo-500',
  '12 mois' : 'bg-pink-100 text-pink-500',
}

const AgencySubscriptionSheet = ( props ) => {

  const { data : subscription, isLoading , isPending , isError } = useAgencySubscription( { enabled : props.open } );

  console.log("Subscription Data: ", subscription);


  
    return (
      <Sheet open={props.open} onOpenChange={props.onOpenChange}>
      <SheetContent side="right" className="!max-w-lg w-[480px] overflow-y-auto no-scrollbar">
      <SheetHeader>
      <SheetTitle>
        <div className='flex items-center gap-3 text-rod-primary font-semibold text-xl '>
          <Shield className="mb-0.5" />
           Mon Abonnement
        </div>
      </SheetTitle>
      <SheetDescription className="text-base text-gray-500 leading-tight">
        Consultez les détails de votre abonnement actuel et vos modules activés.   
      </SheetDescription>
      <Separator className="mt-4"/>
      </SheetHeader>

      {(isLoading || isPending) ? <AgencySubscriptionSkeleton /> 

      : isError ?
        <div className='text-destructive h-full w-full items-center justify-center'>Une erreur est survenue lors du chargement des informations d’abonnement.</div>
        :

      <div className='px-4 space-y-8 pb-8'>
        {/* Subscription Details */}
        <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
          <CardHeader className="w-full px-0">
            <CardTitle className='flex items-center gap-2'>
              <Crown className="mb-0.5" size={24} />
              <h2 className='text-xl font-medium  leading-tight'>Abonnement Rod</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className='space-y-2'>
              <div className='flex flex-col gap-2'>

                {/* Display actual subscription */}
                <div className='flex w-full justify-between items-center'>
                  <span className='text-gray-500 text-sm'>Abonnement Actuel <span className='text-sm font-medium'> {"("} {subscription?.period_abonnement} {")"} </span></span>
                  
                  {subscription?.period_price  !== 'free' ?
                    <span className='text-green-600 text-sm font-semibold bg-green-100 rounded-xl px-3 leading-tight py-1'>Essai Gratuit</span>
                    :

                    <span className={`text-sm font-semibold rounded-xl px-3 leading-tight py-1 ${period[subscription?.period_abonnement]}`}>{subscription?.period_abonnement}</span>
                    
                  }
                </div>

                {
                  Array.from({ length: subscription?.number_invoices }).map((_,i) => {

                    const facture = subscription?.facturesabonnement[i];

                    return (
                       <div className='flex w-full justify-between items-center'>
                          <span className='text-gray-500 text-sm'>{facture?.reference_facture_abonnement  || `Facture ${i + 1}`} 
                            {
                              facture?.total_ht ?
                              `(${facture?.voitures} * ${facture?.price_per_car} DT)` : " (a venir)"
                            }
                          </span>
                          {!facture?.total_ht ?
                          <span className=' text-base font-medium mr-4'>_</span>
                          :
                          <span className='text-base font-medium '>{facture?.total_ht} DT</span>
                          }
                        
                        </div>
              
                    )
                  }
                  ) 
                }

                {

                  (subscription?.period_price !== "free" &&  subscription?.period_price)  ?
                   <div className='flex w-full justify-between items-center'>
                    <span className='text-gray-500 text-sm'>
                     Total Abonnement
                    </span>
                    {!subscription?.period_price ?
                    <span className=' text-base font-medium mr-4'>_</span>
                    :
                    <span className='text-base font-medium '>{subscription?.period_price} DT</span>
                    }
                  
                  </div> : null
                }
               
              </div>
              
                
            </div>
          </CardContent>
           </Card>


          {
            subscription?.next_invoice ?
                 <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
              <CardHeader className="w-full px-0">
                <CardTitle className='flex items-center gap-2'>
                  <Calendar className="mb-1"  size={24} />
                  <h2 className='text-xl font-medium leading-tight'>Prochaine facturation</h2>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2">
                  {/* Subscription details */}
                <div className='space-y-2'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex w-full justify-between items-center'>
                        <span className='text-gray-500 text-sm'>Facturation prévue dans :</span>
                        <span className="text-base font-semibold text-orange-500">{subscription?.days_until_next_invoice} jour{subscription?.days_until_next_invoice > 1 ? 's' : ''}</span>
                      </div>

                      <div className='flex w-full justify-between items-center'>
                        <span className='text-gray-500 text-sm'>Date de facturation :</span>
                        <span className='text-base font-medium '>
                        {subscription?.next_invoice
                        ? 
                        FormatDateEEEEddMMyyyy(subscription?.next_invoice) : ''}
                        </span>
                      </div>

                        <div className="flex text-gray-500 items-center justify-between ">
                          <div className="text-sm flex gap-1 font-normal items-center"> Voitures dans la flotte</div>
                          <span className={`text-base font-medium text-rod-primary `}>{subscription?.number_of_garages || 0} </span>
                        </div>

                      <div className='flex w-full justify-between items-center'>
                        <span className='text-gray-500 text-sm'>Prix par voiture :</span>
                        <span className='text-base font-medium '>
                        { `${subscription?.currentPriceRod} DT`}
                        </span>
                      </div>

                       <div className='flex w-full justify-between items-center'>
                        <span className='text-gray-500 text-sm'>Montant Estimé :</span>
                        <span className='text-base font-medium '>
                        { `${subscription?.estimated} DT`}
                        </span>
                      </div>
                    
                  </div>

                  <Separator className="mt-4 mb-2"/>

                  <p className='text-sm text-gray-500'>
                  Le montant sera calculé en fonction de votre flotte au <br />
                  {
                  subscription?.next_invoice
                    ? " "+FormatDateddMMyyyy(subscription?.next_invoice)
                    : ''}
                    {"."}
                  </p>
                </div>
              </CardContent>
          </Card> :null
          }

          {/* Next Billing Details */}
         

          {/* Active Modules */}
        {
          !subscription?.unpaid_invoice && !subscription?.unpaid_invoice?.length > 0 ?
        
        <Card className="w-full max-full pb-8 px-4 pt-4  shadow-none ">
          <CardHeader className="w-full px-0">
            <CardTitle className='flex items-center gap-2'>
              <FileText  size={24} />
              <h2 className='text-xl font-medium leading-tight'>{subscription?.unpaid_invoice?.length || test?.length} Factures Impayées</h2>
            </CardTitle>
          </CardHeader>
        <CardContent className="px-2 space-y-6">
          <div className='space-y-4'> 
            {
              //subscription?.unpaid_invoice.map((invoice, index) => (
              test?.map( ( invoice , index ) => (
              <div className="relative p-4 border border-gray-200 rounded-lg"> 
                <Badge className="absolute  top-4 right-4 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-0.5">
                    <X size={12} />
                    <span >Impayée</span>
                  </Badge>
                
                <div className="flex items-center h-fit gap-3 mb-2">
                
                  <div className="flex  flex-col gap-2">
                    <h3 className="font-bold text-sm leading-tight flex items-center gap-2"><span className="p-1.5 bg-rod-foreground rounded-md"><Hash size={14} /></span>{invoice?.reference_facture || `Facture N°${index + 1}`}</h3>
                    <span className="text-gray-500  text-sm flex flex-col gap-1.5 leading-none mx-1">
                      <div>Facturé le <span className=" text-gray-500 leading-none">{formatDateDDMMYYYY(invoice?.date_facture)}</span></div>
                      <div>A payer avant le <span className=" text-gray-500 leading-none">{formatDateDDMMYYYY(invoice?.date_echeance)}</span></div>
                    </span>
                  </div>
                </div>


                <Separator className="mt-4 mb-2"/>


                <div className="flex justify-between items-center mx-1">
                  <div className="flex flex-col">
                  <div className="text-rod-primary text-sm font-bold">{invoice?.number_of_cars} voitures</div>
                  <div className="text-gray-500 text-sm leading-none">{invoice?.price_per_car}DT / voiture</div>
                  </div>

                  <div className="flex flex-col items-end ">
                    <div className="text-rod-primary text-sm font-bold">{invoice?.total_ttc} TTC</div>
                  <div className="text-gray-500 text-sm leading-none">{invoice?.total_ht}DT (hors taxes)</div>
                  </div>
                  
                  
                </div>
              
            
          </div>
          ) )
          }

          

       
        </div>

        </CardContent>
        </Card> : null
        }
      
      </div>          
      }
      </SheetContent>
    </Sheet>
    )
}

export default AgencySubscriptionSheet