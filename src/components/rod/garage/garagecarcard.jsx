import { AlertTriangle, ArrowUpRight, Eye, Gauge, ShoppingCart, X } from "lucide-react"
import ToolTipCustom from "../../customUi/tooltip";
import { carColors } from "../../../utils/colors";
import { finishEffects } from "../../../utils/colors";
import { Button } from '@/components/ui/button';
import {
    MarkInRepair,
    MarkAvailable,
} from "../../modals/garage/changePanne/brokenCar"
import { memo , useState } from "react";
import {AlertOfferResumed} from "../../modals/garage/changePanne/brokenCar"
import { ResilierContratModal } from "../../modals/contrat/ResilierContratModal";
import DetailOffreModal from "../../modals/offre/DetailOffreModel/DetailOffreModal"; 


const GarageCarCard= memo(({setKilometrage , setCarModal,setOffreOpen, car , setContratModal })=>{
    console.log("Rendering car card id_garage: ", car);
    
    const [showOfferDetailModal, setShowOfferDetailModal] = useState(false);
    const [showOfferResumedAlertModal, setShowOfferResumedAlertModal] = useState(false);
    const [showResilierModal, setShowResilierModal] = useState(false);

    const offre = car?.offres[0];
    const contrat = car?.offres[0]?.demandes[0]?.contrats[0];

    console.log("car in GarageCarCard:", offre , contrat);

    const handleOpenContrat = () => {
        if (contrat) {
            setContratModal({ open: true, id_contrat: contrat.id_contrat });
        } 
    };

    console.log("car in GarageCarCard:", showResilierModal);
    
    // status settings
    const statusClasses = {
        DISPONIBLE:  { color: "bg-emerald-700", title: "Disponible" },
        PUBLIE: { color: "bg-amber-600", title: "Publié" },
        EN_LOCATION: { color: "bg-sky-700", title: "En Location" },
        EN_PANNE: { color: "bg-red-600", title: "En Panne" },
    };

    const statusButtons ={
        DISPONIBLE: {
            Button1 : 

                <ToolTipCustom
                trigger={
                <Button onClick={() => setOffreOpen({open:true,id_garage:car.id_garage})} className="flex-1 h-7 desktop-lg:h-9 flex gap-2 desktop-lg:!text-base desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm" > {/* hedhi felsa mta trigger el modal gedo style ldekhel */}
                    <ShoppingCart className="mb-0.5"  />
                    <span className="leading-none ">Publier</span>
                </Button>
                }
                message={"Publier cette voiture"}
                />, 
            Button3: <MarkInRepair id={car.id_garage} /> },
        PUBLIE: {
            Button1 : 
            <Button onClick={() => setShowOfferDetailModal(true)} className="flex-1 h-7 desktop-lg:h-9 flex gap-2 desktop-lg:!text-base desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm" > {/* hedhi felsa mta trigger el modal gedo style ldekhel */}
                    <ArrowUpRight className="mb-0.5"  />
                    <span className="leading-none ">Offre</span>
                </Button> ,
            Button3: 
             <MarkInRepair id={car.id_garage} status_garage="PUBLIE" status_offre= {car.offres[0]?.status_offre}/> 
        },
        EN_LOCATION: {
            Button1 : <Button onClick={handleOpenContrat} className="flex-1 h-7 desktop-lg:h-9 flex gap-2 desktop-lg:!text-base desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm" > {/* hedhi felsa mta trigger el modal gedo style ldekhel */}
                    <ArrowUpRight className="mb-0.5"  />
                    <span className="leading-none ">Contrat</span>
                </Button> ,
            Button3: 
                <ToolTipCustom
                    trigger={
                        <Button 
                            onClick={() => setShowResilierModal(true)} 
                            variant="outline" 
                            size="icon" 
                            className="flex size-7 desktop-lg:size-9 desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm"
                        >
                            <X />
                        </Button>
                    }
                    message="Résilier le contrat"
                /> },
        EN_PANNE: {
            Button1 :  <ToolTipCustom
                trigger={
                <Button  className="flex-1 h-7 cursor-not-allowed bg-muted-foreground hover:bg-muted-foreground desktop-lg:h-9 flex gap-2 desktop-lg:!text-base desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm" > {/* hedhi felsa mta trigger el modal gedo style ldekhel */}
                    <ShoppingCart className="mb-0.5"  />
                    <span className="leading-none ">Publier</span>
                </Button>
                }
                message={"La publication d’une voiture en panne n’est pas autorisée"}
                /> ,
            Button3: <MarkAvailable id={car.id_garage} openOfferResumedAlert={()=>setShowOfferResumedAlertModal(true)} /> },
    }

    
    return(
        <div  className="relative w-full h-full grid grid-rows-[45%_1fr] p-3 desktop-lg:p-4 bg-white rounded-lg shadow-card-garage hover:shadow-card-garage-hover transition-all duration-500 ease-in-out">
            <AlertOfferResumed open={showOfferResumedAlertModal} onClose={()=>setShowOfferResumedAlertModal(false)} /> 

            {car.status_garage === "EN_LOCATION" && contrat && showResilierModal && (
                <ResilierContratModal
                    open={showResilierModal}
                    onClose={() => setShowResilierModal(false)}
                    id_contrat={contrat.id_contrat}
                    id_demande={car.offres[0].demandes[0].id_demande}
                    id_garage={car.id_garage}
                    kilometrage={car.kilometrage_garage}
                    contractNumber={contrat.sequence_contrat} 
                />
            )}


            { car.status_garage === "PUBLIE" && offre && showOfferDetailModal  && (
                <DetailOffreModal open={showOfferDetailModal} onClose={() => setShowOfferDetailModal(false) } id={car?.offres[0]?.id_offre} badge={""} />
            )
            }
            

            {/* matricule */}
            <div className="absolute top-3 left-3 desktop-lg:top-4 desktop-lg:left-4 bg-rod-primary text-white text-xs desktop-lg:text-sm rounded-sm font-medium px-1.5 desktop-lg:px-2 py-0.5">
                {car.matricule_garage}
            </div>

            {/* status and alert */ }
            <div className="absolute top-3 right-3 desktop-lg:top-4 desktop-lg:right-4  flex flex-col items-end gap-2">
                <span className={` ${statusClasses[car.status_garage].color} text-white text-xs desktop-lg:text-sm rounded-sm font-medium px-1.5 desktop-lg:px-2 py-0.5`}>
                    {statusClasses[car.status_garage].title}
                </span>
                {(car.probleme_assurance !== false || car.probleme_controle  !== false || car.probleme_vignette !== false) && (
                    <ToolTipCustom
                        trigger={
                        <AlertTriangle className="h-5 w-5 desktop-lg:w-6 desktop-lg:h-6 text-amber-500" />
                        }
                    message={
                        <div className="space-y-1 pb-2">
                            <h4 className="font-semibold  text-sm">
                                Problème(s) à régler :</h4>
                            <ul className="space-y-1 text-sm text-gray-700">
                                {car.probleme_controle !==false && (
                                    <li className="flex items-center gap-2">
                                        {
                                            car.probleme_controle==="expired" ?
                                            <>
                                            <div className="w-1.5 h-1.5 mt-1 bg-rod-accent rounded-full flex-shrink-0" />
                                            Visite technique expirée
                                            </>
                                            :

                                            car.probleme_controle === 0 ?
                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Visite technique expire aujourd'hui
                                            </>
                                            :

                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Visite technique expire dans {car.probleme_controle} jour{car.probleme_controle > 1 ? 's' : ''}
                                            </>                                            

                                        }
                                        
                                    </li>
                                )}
                                {car.probleme_assurance !== false && (
                                    <li className="flex items-center gap-2">
                                        {
                                            car.probleme_assurance==="expired" ?
                                            <>
                                            <div className="w-1.5 h-1.5 mt-1 bg-rod-accent rounded-full flex-shrink-0" />
                                            Assurance expirée
                                            </>
                                            :

                                            car.probleme_assurance === 0 ?
                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Assurance expire aujourd'hui
                                            </>
                                            :

                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Assurance expire dans {car.probleme_assurance} jour{car.probleme_assurance > 1 ? 's' : ''}
                                            </>

                                        }
                                    </li>
                                )}
                                {car.probleme_vignette !== false && (
                                    <li className="flex items-center gap-2">
                                        {
                                            car.probleme_vignette==="expired" ?
                                            <>
                                            <div className="w-1.5 h-1.5 mt-1 bg-rod-accent rounded-full flex-shrink-0" />
                                            Vignette expirée
                                            </>
                                            :

                                            car.probleme_vignette === 0 ?
                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Vignette expire aujourd'hui
                                            </>
                                            :

                                            <>
                                                <div className="w-1.5 h-1.5 mt-1 bg-amber-500 rounded-full flex-shrink-0" />
                                                Vignette expire dans {car.probleme_vignette} jour{car.probleme_vignette > 1 ? 's' : ''}
                                            </>

                                        }
                                    </li>
                                )}
                            </ul>
                        </div>
                    }
                    />
                    
                )}

            </div>

            {/* car image */}
            <div className="w-full max-h-24  desktop-lg:max-h-32 pt-3 desktop-lg:pt-5 h-full flex items-center justify-center overflow-hidden">
                <img src={car.image_voiture}  alt={car.nom_voiture} className="w-auto h-full  object-cover"  />
            </div>

            <div className="w-full flex flex-col justify-between items-center h-full">

                {/* car details */}
                <div className="flex flex-col gap-1 desktop-lg:gap-2 items-center mt-2 desktop-lg:mt-4">
                    <h3 className="text-base  desktop-lg:text-lg font-semibold text-gray-800 leading-none truncate">{car.nom_voiture}</h3>
                    <ToolTipCustom 
                        trigger={
                        <p className="text-sm  desktop-lg:text-base text-gray-500 leading-none truncate">
                        {car.version_voiture}
                        </p>
                        }
                    message={car.version_voiture}
                    />
                </div>


                {/* car kilometrage & color */}
                <div className="flex  gap-2 desktop:gap-4 items-center">
                    

                    <ToolTipCustom 
                        trigger={
                        <span className="text-sm  desktop-lg:text-base flex gap-1 items-center  ">
                            <Gauge className="h-4 w-4 mb-0.5 desktop-lg:h-5 desktop-lg:w-5" />
                            <span className="leading-none  max-w-[80px] desktop:max-w-[128px] truncate">{car.kilometrage_garage} km</span>
                        </span>
                        }
                    message={car.kilometrage_garage + " km"}
                    />


                    <ToolTipCustom 
                        trigger={
                        <span className="text-sm  desktop-lg:text-base flex gap-2 items-center  ">
                            <span className={`h-4 w-4 mb-0.5 rounded-xs ${(car.couleur_garage==="Blanc" || car.couleur_garage==="Crème" || car.couleur_garage==="Beige" ) && "border-gray-400 border"}`} style={{ backgroundColor: carColors[car.couleur_garage] , ...finishEffects[car.couleur_finition_garage]}} >
                            </span>
                            
                            <span className="leading-none  max-w-[80px] desktop:max-w-[128px] desktop-lg:max-w-none truncate">
                                {car.couleur_garage} {car.couleur_finition_garage}
                            </span>
                        </span>
                        }
                    message={`${car.couleur_garage} ${car.couleur_finition_garage}`}
                    />

                    
                </div>


                {/* actions Buttons */}

                <div className="w-full flex justify-between gap-2 desktop-lg:gap-3 ">
                     {// button 1
                        statusButtons[car.status_garage].Button1
                    } 

                    <div className="flex items-center gap-1.5 desktop-lg:gap-2">
                        { /* button to open update kilometrage modal */}
                        <ToolTipCustom
                                  trigger={
                                    <Button onClick={() => setKilometrage({ open: true, id: car.id_garage ,kilometrage: car.kilometrage_garage })} variant="outline" className="flex size-7 desktop-lg:size-9 desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm">
                                      <Gauge />
                                    </Button>
                                  }
                                  message="Mettre à jour le kilométrage"
                        />


                        {/* button to open car modal */}
                         <ToolTipCustom
                            trigger={
                            <Button onClick={() => setCarModal({ open: true, id_garage: car.id_garage })} variant="outline" size="icon" className="flex size-7 desktop-lg:size-9 desktop-lg:[&>svg]:!w-5 desktop-lg:[&>svg]:!h-5 rounded-sm ">
                                <Eye />
                            </Button>
                            }
                            message={"Voir les détails du véhicule"}
                        />




                        {// button 3
                        statusButtons[car.status_garage].Button3
                        } 
                    </div>

                </div>

            </div>

            

        </div>
    )
}, (prevProps, nextProps) => {
    const prevCar = prevProps.car;
    const nextCar = nextProps.car;

    const prevOffre = prevCar.offres?.[0] || {};
    const nextOffre = nextCar.offres?.[0] || {};

    const prevContrat = prevCar.contrats?.[0] || {};
    const nextContrat = nextCar.contrats?.[0] || {};

    return (
        prevCar.probleme_assurance === nextCar.probleme_assurance &&
        prevCar.probleme_controle === nextCar.probleme_controle &&
        prevCar.probleme_vignette === nextCar.probleme_vignette &&
        prevCar.status_garage === nextCar.status_garage &&
        prevCar.id_garage === nextCar.id_garage &&
        prevCar.kilometrage_garage === nextCar.kilometrage_garage &&
        prevCar.couleur_finition_garage === nextCar.couleur_finition_garage &&
        prevCar.couleur_garage === nextCar.couleur_garage &&
        prevOffre.status_offre === nextOffre.status_offre &&
        prevOffre.id_offre === nextOffre.id_offre &&
        prevContrat.id_contrat === nextContrat.id_contrat
    );
});

export default GarageCarCard;