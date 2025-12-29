import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { FileText, Building2, History, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DepenseDetailsTab from "./DepenseDetailsTab";
import FournisseurTab from "./FournisseurDetailsTab"; 
import { useFetchArchiveDetailDepense } from "../../../../api/queries/depense/useFetchArchiveDepenseDetail";
import PaiementHistoryTab from "./PaiementHistoryTab";

function ViewDepenseModal({ open, id_depense, close }) {
  const [activeTab, setActiveTab] = useState(0);
  console.log("depense id in modal:", id_depense);
  const { data, isLoading, isError } = useFetchArchiveDetailDepense(id_depense);
  
  console.log("API response:", data);

  const tabs = [
    { label: "Détails de la dépense", icon: FileText },
    { label: "Fournisseur", icon: Building2 },
    { label: "Historique des paiements", icon: History },
  ];

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="flex max-w-[776px] h-[420px] scale-80 desktop:scale-90 desktop-lg:scale-110 flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>
            Dépense {data?.depense?.sequence_depense || "#"}
          </DialogTitle>
          <DialogDescription className="leading-tight text-base -mt-2">Consultez les informations relatives à cette dépense</DialogDescription>
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
                      layoutId="TabsdepenseDetail"
                      className="absolute inset-0 rounded-sm bg-white"
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    />
                  )}
                  <IconComponent
                    className={`w-4 h-4 mb-0.5 shrink-0 relative z-10 transition-colors ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span
                    className={`text-base font-medium whitespace-nowrap relative z-10 transition-colors cursor-pointer ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="animate-spin w-6 h-6 text-rod-primary" />
          </div>
        ) : isError ? (
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
              className="w-full flex-1 flex flex-col overflow-hidden"
            >
              {activeTab === 0 && <DepenseDetailsTab depense={data?.depense} />}
              {activeTab === 1 && <FournisseurTab depense={data?.depense} />}
              {activeTab === 2 && (
                <PaiementHistoryTab
                  payments={data?.paiements}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ViewDepenseModal;