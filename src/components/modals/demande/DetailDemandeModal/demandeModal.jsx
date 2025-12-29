import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogHeader,
    DialogFooter,
} from '@/components/ui/dialog';
import { useState } from 'react';
import {Button} from '@/components/ui/button';
import { Check, Handshake, Info, Shield, X , Loader2, ClipboardList, Ban, XCircle,  Undo2} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {  FormatDateEEEEddMMyyyy } from '../../../../utils/dateConverter';
import { Badge} from '@/components/ui/badge';
import { useEffect } from 'react';
import { useUpdateDemandeSeen } from '../../../../api/queries/demande/useMarkDemandesAsSeen';
import { useUpdateDemande } from '../../../../api/queries/demande/useUpdateDemandes';
import { useFetchDetailDemande } from '../../../../api/queries/demande/useFetchDemandDetails'
import { Phone } from 'lucide-react';
import { raisonsShow } from '../../../../utils/demandReasons';
import DetailsCard from './DetailsCard'
import {
    Alert,
    AlertTitle,
    AlertDescription,
} from '@/components/ui/alert'
import { RefuseDemand } from '../refuseDemandModal';
import PolitiquesOffreCard from '../../offre/DetailOffreModel/PolitiqueOffreCard';
import PriceCard from './PriceCard'
import ClientCard from './ClientCard'
import VoitureCard from './VoitureCard'
// eslint-disable-next-line no-unused-vars
import {AnimatePresence, motion} from 'framer-motion'



export const DemandeModal = ({ id_demande , notification_demande , client , date_creation , close , setModalContrat  }) => {

    const { mutate: markAsSeen } = useUpdateDemandeSeen();


    useEffect(() => {
        if (!notification_demande) {
            markAsSeen({ id_demande });
        }
    }, []);

    const {mutate , isPending } = useUpdateDemande();

    const handleAPAYE = () => {
        mutate({ id_demande, status_demande: "APAYE" });
    }

    const handleRECU = () => {
        mutate({ id_demande, status_demande: "RECU" });
    }

    const {data , isLoading , isError , isFetching} = useFetchDetailDemande(id_demande);

        console.log('data in demande modal:', data);


    const [activeTab, setActiveTab] = useState(0);
    const tabs = [
            { label: 'Demande & Prix', icon: Handshake },
            { label: 'Client & Véhicule', icon: Info },
            { label: 'Politiques & Conditions', icon: Shield },
    ]




    const renderFooter = () => {
        switch (data.status_demande) {
          case "RECU" :
            return (
              <>
                <RefuseDemand id_demande={id_demande} disabled={isPending || isFetching} loading={isPending || isFetching} />
                <Button className="w-1/2" variant="default" disabled={isPending || isFetching} onClick={handleAPAYE}>
                        {
                          (isPending || isFetching) ? <> <Loader2 className="animate-spin" /> En Cours... </> : <> <Check /> Confirmer</>
                        }
                </Button>
              </>
            )
        case "APAYE" :
          return (
            <>
              <RefuseDemand id_demande={id_demande} disabled={isPending || isFetching} loading={isFetching} />
              <Button className="w-1/2" onClick={() => setModalContrat({open: true , demande: data})}>
              <Check />
                  Établir contrat
              </Button>
            </>
          )
        case "REFUSE":
          return (
            <>
              <Button className="w-1/2" variant="outline" onClick={close}>
                <X />
                Fermer
                
              </Button>
              <Button className="w-1/2" variant="default" disabled={isPending || data.raison_annulation_demande === "OFFRE_INDISPONIBLE" || isFetching} onClick={handleRECU}>
                  {
                    (isPending || isFetching) ? <> <Loader2 className="animate-spin" /> En Cours... </> : <> <Undo2 /> Réinitialiser</>
                  }
              </Button>
            </>
          )
        case "ANNULE":
          return null;
    }}

    return (
    <Dialog open={true} onOpenChange={close}>
        <DialogContent className={`flex max-w-[996px] min-h-[548px] scale-80 desktop:scale-90 desktop-lg:scale-110 flex-col h-auto`}>
            <DialogHeader className="flex-shrink-0">
            <DialogTitle className="w-full leading-tight"> 
                Demande de location 
            </DialogTitle>
            <DialogDescription className=' leading-tight text-base -mt-2'>
                Demande de location reçue le {FormatDateEEEEddMMyyyy(date_creation)}, effectuée par le client {client}.
            </DialogDescription>
            <Separator />

            {/* Tab Navigation */}
          <div className="w-full flex items-center justify-between rounded-md p-1 bg-rod-foreground mt-1 relative overflow-hidden">
            {tabs.map((tab, id) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === id;

              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="w-full py-1 flex justify-center items-center gap-2 relative z-10 cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                     layoutId="TabsDemandeDetail"
                    className="absolute inset-0 rounded-sm bg-white"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  )}
                  <IconComponent
                    className={`w-4 h-4 mb-0.5 shrink-0 relative z-10 transition-colors ${
                      isActive ? "text-rod-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-base font-medium whitespace-nowrap relative z-10 transition-colors cursor-pointer ${
                      isActive ? "text-rod-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>


            {/* flags here */ }
            {
                (!isLoading && !isError) && ( 
                  <div className='flex justify-between mt-2 px-2'>
                    <div className="flex items-center justify-start gap-3 ">
                        
                        <Badge variant="outline"  className='  px-2 py-1 leading-none text-sm  font-semibold'> {data.offre.garage.nom_voiture} </Badge>
                        <Badge variant="outline"  className=' px-2 py-1 leading-none text-sm  font-semibold'> {data.offre.garage.matricule_garage} </Badge>
                        <Badge variant="outline" className='   px-2 py-1 leading-none text-sm font-semibold'> {data.offre.sequence_offre} </Badge>
                        {
                            data.prix_total_chauffeur && data.prix_total_chauffeur > 0 &&
                            <Badge variant="default" className="text-sm h-full ">
                                Avec Chauffeur
                            </Badge>
                        }
                        {
                            data?.promo_appliquee && 
                            <Badge variant="default" className="bg-rod-accent font-semibold text-sm h-full ">
                                En Promo {data.promo_appliquee}% 
                            </Badge>
                        }
                    </div> 

                    <div className='flex items-center justify-end '>
                  <Badge
                    variant="secondary"
                    className={`${badgeConfig[data.status_demande]?.class} px-2 py-1 leading-none text-sm font-semibold`}
                  >
                    {badgeConfig[data.status_demande]?.label || data.status_demande}
                  </Badge>
                    </div>
                  </div>
                )
            }
            
            </DialogHeader>

            { /* body here */}
            {isLoading ? (
                <div className="flex flex-1 mb-12 items-center justify-center h-full">
                    <Loader2 className="animate-spin " />
                </div>
                ) : isError ? (
                <div className="flex flex-col flex-1 gap-3 items-center text-center justify-center  h-full">
                    <span className="bg-red-50 p-3 rounded-full"><Info className="text-rod-accent w-7 h-7" /></span>
                    <p className="text-rod-accent">Une erreur s'est produite lors du chargement des détails du demande.
                    <br />
                    Veuillez réessayer plus tard.
                    </p>
                </div>
                ) : (
                    <>
        <div className='flex flex-col gap-6  flex-1'>
            <div className='w-full flex justify-between gap-6'>
               <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
               initial={{ opacity: 0.3, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.3, y: -4 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full"
              >
            {activeTab === 0 ? 
                  
            (<div className="grid grid-cols-2 gap-6">
               <DetailsCard demande={data} />
               <PriceCard prices={data} />
               
            </div> ):activeTab===1 ?(
           <div className='grid grid-cols-2 gap-x-6'>
              <VoitureCard garage={data.offre.garage} />
              <ClientCard client={data.client} />
           </div>
          )
        :(
            <PolitiquesOffreCard data={data.offre}  />
          )
        }
        </motion.div>
        </AnimatePresence>
        </div>
        <ALertCard client = {data.client } status = {data.status_demande} data={data} />
        </div>
        {data.status_demande !== "ANNULE" &&
        <DialogFooter className="mt-2">
              {renderFooter()}
        </DialogFooter>
                        }</>
                    )
                }
        </DialogContent>
    </Dialog>
    );
};





//alert 

const badgeConfig = {
  RECU: {
    label: "Reçue",
    class: "bg-blue-100 text-blue-600",
  },
  APAYE: {
    label: "Confirmée",
    class: "bg-green-100 text-green-600",
  },
  ANNULE: {
    label: "Annulée",
    class: "bg-amber-100 text-amber-600",
  },
  REFUSE: {
    label: "Refusée",
    class: "bg-red-100 text-red-600",
  },
}


const ALertCard = ({ client, status, data }) => {
  const statusConfig = {
    RECU: {
      title: "Prenez contact avec le client",
      description: (
        <p>
          Appelez <span className="font-semibold">{client?.nom_client}</span> au{" "}
          <span className="font-semibold">{client?.telephone_client}</span> pour
          obtenir sa confirmation concernant la réservation.
        </p>
      ),
      icon: Phone,
      styles: {
        alert: "bg-blue-500/10 text-blue-600  border border-blue-200",
        description: "text-blue-600/80",
      },
    },
    APAYE: {
      title: "Prêt pour le retrait du véhicule",
      description:
        "Vérifiez son identité et son permis de conduire, puis cliquez sur Établir contrat",
      icon: ClipboardList,
      styles: {
        alert: "bg-green-500/10 text-green-600  border  border-green-200",
        description: "text-green-600/80",
      },
    },
    REFUSE: {
      title: "Demande refusée",
      description: raisonsShow[data?.raison_annulation_demande] || null,
      icon: Ban,
      styles: {
        
        alert: 'bg-red-500/10 text-red-600  border  border-red-200',
        description: "text-red-600/80",
      },
    },  
    ANNULE: {
      title: "Demande Annulée",
      description: raisonsShow[data?.raison_annulation_demande] || null,
      icon: XCircle,
      styles: {
        
        alert: "bg-amber-500/10 text-amber-600  border  border-amber-200",
        description: "text-amber-600/80",
      },
    }
  }

  const cfg = statusConfig[status]
  if (!cfg) return null

  const Icon = cfg.icon

  return (
    <Alert className={cfg.styles.alert}>
      {Icon && <Icon className="w-5 h-5 mt-0.5 shrink-0" />}
      <AlertTitle className="font-medium text-base">{cfg.title}</AlertTitle>
      <AlertDescription className={cfg.styles.description}>
        {cfg.description}
      </AlertDescription>
    </Alert>
  )
}
