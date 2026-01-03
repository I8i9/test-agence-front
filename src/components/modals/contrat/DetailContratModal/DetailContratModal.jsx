import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import DetailGeneralCard from "./DetailGeneraleCard";
import TarificationCard from "./TarificationCard";
import ConducteurCard from "./ConducteurCard";
import { useState, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFetchDetailContrat } from "../../../../api/queries/contrat/useFetchContratById";
import { Camera, CheckCircle, Fuel, Info, Loader2, Printer, Shield, TriangleAlert, User } from "lucide-react";
import PolitiquesOffreCard from "../../offre/DetailOffreModel/PolitiqueOffreCard";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import ImagesCard from "./ImagesCard";
import { formatDateDDLLLLYYYY, formatDateDDMMYYYY, formatTimeHHmm } from "../../../../utils/dateConverter";
import { printText } from "../../../../utils/printFunction";
import { useCanPrint } from "../../../../hooks/useCanPrint";

const stylebadge = (badge) => {
  let styleClass = "";
  switch (true) {
    case badge === "En cours":
      styleClass = "bg-green-100 text-green-600";
      break;
    case badge.startsWith("Expire"):
      styleClass = "bg-amber-100 text-amber-600";
      break;
    case badge === "Planifiée" || badge.startsWith("Commence"):
      styleClass = "bg-blue-100 text-blue-600";
      break;
    case badge === "Expirée":
      styleClass = "bg-red-100 text-red-600";
      break;
    case badge === "Annulé" : 
      styleClass = "bg-orange-100 text-orange-600";
      break;
    case badge === "Résilié":
      styleClass = "bg-indigo-100 text-indigo-600";
      break;
    default:
      styleClass = "bg-rose-100 text-rose-600";
  }
  return styleClass + " px-2 py-1 leading-none text-sm font-semibold";
};

function DetailContratModal({ id, open, onClose}) {
  const { data, isLoading, isError } = useFetchDetailContrat(id);
  const [activeTab, setActiveTab] = useState(0);  

  const {canPrint , config} = useCanPrint();

  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("auto");

  console.log("DetailContratModal data:", data);

  // Use layout effect to measure content height after render
  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [activeTab, data, isLoading]);

  const tabs = [{ label: "Détails du contrat", icon: Info , index : 0},
    
    // Using ternary for clarity
    (data?.conducteur || data?.conducteur_supplementaire) 
      ? { label: "Conducteur(s)", icon: User , index : 1} 
      : null,
      
    { label: "Politiques et conditions", icon: Shield , index : 2},
    
    // Using ternary to avoid returning 'false' or '0'
    data?.hasImages 
      ? { label: "État du Véhicule", icon: Camera , index : 3} 
      : null,
      
  ].filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="flex max-w-[976px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col"
        style={{ minHeight: contentHeight }}
      >
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight">
            Contrat {data?.sequence_contrat}
          </DialogTitle>
          <DialogDescription className="leading-tight text-base -mt-2">
            contrat de location de voiture {data?.informations_generales?.voiture}
          </DialogDescription>
          <Separator />

          <div className="w-full flex items-center justify-between overflow-hidden rounded-md p-1 bg-rod-foreground mt-1 relative">
            {tabs.map((tab, id) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.index;

              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(tab.index)}
                  className="w-full py-1 flex justify-center items-center gap-2 relative z-10 cursor-pointer"
                >
                  {isActive && (
                    <motion.div
                      layoutId="tabHighlightDetailContrat"
                      className="absolute inset-0 rounded-sm"
                      style={{ backgroundColor: "white" }}
                      transition={{ type: "spring", stiffness: 250, damping: 35,duration:0.2 }}
                    />
                  )}
                  <IconComponent
                    className={`w-4 h-4 mb-0.5 shrink-0 relative z-10 transition-colors ${
                      isActive ? "text-rod-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-base font-medium whitespace-nowrap relative z-10 transition-colors  ${
                      isActive ? "text-rod-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>


          {
            /* Badges et informations supplémentaires  show after loading*/
            !isLoading && !isError && data ?
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="px-2 py-1 text-sm font-semibold">
                  {data?.informations_generales?.voiture}
                </Badge>
                <Badge
                  variant="outline"
                  className="px-2 py-1 leading-none text-sm font-semibold"
                >
                  {data?.informations_generales?.matricule}
                </Badge>

                { 
                data?.informations_generales?.niveau_carburant_depart_contrat &&
                <Badge variant="outline"   className={`[&>svg]:size-4 px-2 py-1 leading-none text-sm font-semibold`}>
                  <Fuel className="mb-0.5" /> {data?.informations_generales?.niveau_carburant_depart_contrat}
                </Badge>
              }

              {
                data?.prix_totale_penalite ?
                <Badge variant="outline" className={`bg-red-100 border-red-200 text-red-600 px-2 py-1 leading-none text-sm font-semibold`}>
                  <TriangleAlert className="mb-0.5"/>Pénalisé : {data?.prix_totale_penalite} DT
                </Badge>
                : null
              }

              {
                data?.informations_generales?.date_prolongation &&
                <Badge className={`bg-purple-100 text-purple-600 px-2 py-1 leading-none text-sm font-semibold`}>
                  {
                    data?.informations_generales?.date_prolongation &&  data?.informations_generales?.date_prolongation_2 ?
                    'Prolongé deux fois' :
                    'Prolongé une fois'
                  }
                </Badge>
              }
              
              </div>
              <Badge className={`${ data?.badge ? stylebadge(data?.badge) : ''}  px-2 py-1 text-sm`}>
              {data?.badge === "Terminé" ? <CheckCircle className="  mb-0.5" /> : null} { data?.badge}
              </Badge>
            </div> : null
          }
        
        </DialogHeader>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-[330px]">
            <Loader2 className="animate-spin w-6 h-6 text-rod-primary" />
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-[330px]">
            <p className="text-red-500">
              Une erreur s'est produite lors du chargement des données.
            </p>
          </div>
        ) : (
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                layout
                initial={{ opacity: 0.3, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.3, y: -4 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                ref={contentRef}
                className="w-full"
              >
                {activeTab === 0 ? (
                  <div className="space-y-6">
                    <div className="w-full grid grid-cols-2 gap-x-6">
                      <DetailGeneralCard data={data?.informations_generales} />
                      <TarificationCard
                        badge ={data?.badge}
                        penalite ={data?.prix_totale_penalite}
                        data={data?.tarification}
                        options={
                          {
                            "Service Chauffeur": data?.options?.chauffeur ?? null,
                            "Assurance tous risque": data?.options?.assurance_TR ?? null,
                            "Conducteur Additionnel": data?.options?.conducteur_add ?? null,
                            "Assurance Protection +" : data?.options?.assurance_PR ?? null,
                            "Plein carburant": data?.options?.plein ?? null,
                            "Livraison": data?.options?.livraison ?? null,
                            "Rehausseur": data?.options?.rehausseur ?? null,
                            "Siège bébé": data?.options?.siege_bebe ?? null,
                            "Siège enfant": data?.options?.siege_enfant ?? null,
                            "Option Wi-Fi": data?.options?.wifi ?? null,
                            "Option GPS": data?.options?.gps ?? null,
                          }
                        }
                        numberOptions={
                          {
                            "Rehausseur": data?.nombres_options?.rehausseur || null,
                            "Siège bébé": data?.nombres_options?.siege_bebe || null,
                            "Siège enfant": data?.nombres_options?.siege_enfant || null,
                          }
                        }
                      />
                    </div>
                  </div>
                ) : activeTab === 1 ? (
                  <div className="flex flex-col gap-4">
                    <ConducteurCard data={data?.conducteur} supp={true} />
                    <ConducteurCard
                      data={data?.conducteur_supplementaire}
                      supp={false}
                    />
                  </div>
                ) : activeTab === 2 ? (
                  <PolitiquesOffreCard data={data?.politiques} />
                ) : activeTab === 3 && (
                  <ImagesCard images={data?.images} />
                )
              }
              </motion.div>
            </AnimatePresence>
          </div>
        )}
        {
          canPrint ?
          <div className="flex justify-end pt-2">
            <Button
                disabled={isLoading || isError || !data?.textToPrint ||!canPrint}
                onClick={() =>
                {
                  const printData = {
                      ...(data?.textToPrint ?? {}),
                      location: "",
                      birthDate :data?.textToPrint?.birthDate ?  formatDateDDLLLLYYYY(data?.textToPrint?.birthDate) : null,
                      cin_deliver : data?.textToPrint?.cin_deliver ? formatDateDDMMYYYY(data?.textToPrint?.cin_deliver) : null,
                      permis_deliver : data?.textToPrint?.permis_deliver ? formatDateDDMMYYYY(data?.textToPrint?.permis_deliver) : null,
                      birthDate_cond : data?.textToPrint?.birthDate_cond ? formatDateDDLLLLYYYY(data?.textToPrint?.birthDate_cond) : null,
                      cin_deliver_cond : data?.textToPrint?.cin_deliver_cond ? formatDateDDMMYYYY(data?.textToPrint?.cin_deliver_cond) : null,
                      permis_deliver_cond : data?.textToPrint?.permis_deliver_cond ? formatDateDDMMYYYY(data?.textToPrint?.permis_deliver_cond) : null,
                      date_debut: formatDateDDMMYYYY(data?.textToPrint?.date_debut),
                      heure_debut: formatTimeHHmm(data?.textToPrint?.date_debut),
                      date_retour: formatDateDDMMYYYY(data?.textToPrint?.date_retour),
                      heure_retour: formatTimeHHmm(data?.textToPrint?.date_retour),
                      date_depot: formatDateDDMMYYYY(data?.textToPrint?.date_depot),
                    }
                  console.log("printData:", printData);

                  printText(
                    config ?? {},
                    data?.textToPrint ? printData : {},
                  )
                }
                  
                }
                className="rounded-sm"
              >
            <Printer />
            Imprimer
          </Button>
        </div> : null
        }
        
      </DialogContent>
    </Dialog>
  );
}

export default DetailContratModal;
