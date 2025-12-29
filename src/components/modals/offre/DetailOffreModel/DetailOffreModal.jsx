import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import useFetchOffreById from "../../../../api/queries/offre/usefetchoffrebyid";
import TarificationCard from "./TarificationCard.jsx";
import DetailOffreCard from "./DetailOffreCard.jsx";
import PolitiquesOffreCard from "./PolitiqueOffreCard.jsx";
import { Info, Shield, Loader2, Settings } from "lucide-react";
import PromoOffreCard from "./PromoOffreCard.jsx";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import OptionsOffreCard from "./OptionsOffreCard.jsx";

const stylebadge = (badge) => {
  let styleClass = "";
  switch (true) {
    case badge === "Active":
      styleClass = "bg-green-100 text-green-600";
      break;
    case badge?.startsWith("Expire"):
      styleClass = "bg-amber-100 text-amber-600";
      break;
    case badge === "Expirée":
      styleClass = "bg-red-100 text-red-600";
      break;
    case badge === "Suspendu":
      styleClass = "bg-blue-100 text-blue-600";
      break;
    default:
      styleClass = "bg-gray-100 text-gray-600";
  }
  return styleClass + " px-2 py-1 leading-none text-sm font-semibold";
};

const hasOptions = (data) => {
  if (!data) return false;
  const optionKeys = [
    "wifi",
    "gps",
    "rehausseur",
    "siege_bebe",
    "siege_enfant",
    "plein_carburant",
    "livraison",
    "chauffeur",
    "assurance_PR",
    "assurance_TR",
    "conducteur_additionnel",
  ];
  return optionKeys.some((key) => data?.options[key] !== null);
};

function DetailOffreModal({ id, open, onClose }) {
  const [activeTab, setActiveTab] = useState(0);

  const {
    data,
    isLoading: isOffreLoading,
    isError: isOffreError,
  } = useFetchOffreById(id, { enabled: !!open && !!id });

  const createTabs = (data) => {
    const baseTabs = [
      { label: "Détails de l'offre", icon: Info },
      { label: "Politique et conditions", icon: Shield },
    ];
    if (hasOptions(data)) {
      baseTabs.push({ label: "Options supplémentaires", icon: Settings });
    }
    return baseTabs;
  };

  console.log("DetailOffreModal data:", hasOptions(data));

  const tabs = createTabs(data); 

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-w-[976px] scale-80 desktop:scale-90 desktop-lg:scale-110 flex-col h-auto">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight">
            {data?.sequence_offre}
          </DialogTitle>
          <DialogDescription className="leading-tight text-base -mt-2">
            Offre de location de voiture publiée sur la plateforme Rod
          </DialogDescription>
          <Separator />

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
                     layoutId="TabsOffreDetail"
  
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

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="px-2 py-1 text-sm font-semibold">
                {data?.garage.nom_voiture}
              </Badge>
              <Badge variant="outline" className="px-2 py-1 leading-none text-sm font-semibold">
                {data?.garage?.matricule_garage}
              </Badge>
              {data?.long_term && (
                <Badge variant="outline" className="px-2 py-1 leading-none text-sm font-semibold">
                  Offre LLD
                </Badge>
              )}
            </div>
            <Badge className={stylebadge(data?.badge)}>{data?.badge}</Badge>
          </div>
        </DialogHeader>

        {isOffreLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="animate-spin w-6 h-6 text-rod-primary" />
          </div>
        ) : isOffreError ? (
          <div className="flex items-center justify-center h-[300px]">
            <p className="text-red-500">
              Une erreur s'est produite lors du chargement des données.
            </p>
          </div>
        ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
               initial={{ opacity: 0.3, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0.3, y: -4 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="w-full"
              >
                {activeTab === 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <DetailOffreCard data={data} />
                      <TarificationCard data={data} />
                    </div>
                    <PromoOffreCard data={data?.promo} />
                  </div>
                ) : activeTab === 1 ? (
                  <PolitiquesOffreCard data={data} />
                ) : (
                  <OptionsOffreCard optionsData={data?.options} />
                )}
              </motion.div>
            </AnimatePresence>

        )}
      </DialogContent>
    </Dialog>
  );
}

export default DetailOffreModal;
