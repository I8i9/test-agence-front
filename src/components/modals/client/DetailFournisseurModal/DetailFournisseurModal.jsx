import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { HandCoins, Info } from "lucide-react"
import { useState } from "react"
import DetailsTab from "./DetailsTab"
import DepenseTab from "./DepenseTab"
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";


const DetailFournisseurModal = ({ open, onClose, fournisseur }) => {
  const [activeTab, setActiveTab] = useState('details')

  if (!fournisseur) return null

  const tabs = [
    { id: 'details', label: 'Détails', icon: Info },
    { id: 'depense', label: 'Dépense', icon: HandCoins },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <DetailsTab fournisseur={fournisseur} />
      case 'depense':
        return <DepenseTab fournisseurId={fournisseur.id_fournisseur} />
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}> 
      <DialogContent className="flex max-w-[976px] scale-80 desktop:scale-90 desktop-lg:scale-110 flex-col h-auto ">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight">Détails du Fournisseur</DialogTitle>
          <DialogDescription className="leading-tight text-base -mt-2">
            Informations complètes du fournisseur et ses dépenses
          </DialogDescription>
          <Separator />
          
          {/* Tab Navigation */}
          <div className="w-full flex items-center justify-between rounded-md p-1 bg-rod-foreground mt-1 relative overflow-hidden">
            {tabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id; 
                
                return (
                    <button
                    key={tab.id} 
                    onClick={() => setActiveTab(tab.id)} 
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
        </DialogHeader>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0.3, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0.3, y: -4 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>

      </DialogContent>
    </Dialog>
  )
}

export default DetailFournisseurModal