import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {Button} from "@/components/ui/button" 
import ClientHistoriqueTab from './ClientHistoriqueTab' 
import ClientDetailsTab from "./ClientDetailsTab";
import { Clock8, Info, Eye } from 'lucide-react'
import { useState } from 'react'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function DetailClientModal({ client }) {
  const [activeTab, setActiveTab] = useState('details') // Start with details
  console.log("clientAAAAAAAAAAAAAAAA",client)
  const tabs = [
    { id: 'details', label: 'Détails', icon: Info },
    { id: 'historique', label: 'Historique', icon: Clock8 },
    
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'historique':
        return <ClientHistoriqueTab ClientId={client.id_client} /> 

      case 'details':
        return <ClientDetailsTab client={client} /> 

      default:
        return null
    }
  }

  return (
    <Dialog> 
      <DialogTrigger asChild> 
        <Button variant="ghost" size="icon" className="[&>svg]:!w-5 [&>svg]:!h-5 ">
      <Eye />
    </Button>
      </DialogTrigger>
      <DialogContent className={`flex max-w-[996px] ${activeTab === 'historique' ? ' h-[548px]' : 'h-[409px]'} scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col overflow-hidden`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight"> 
            {client?.nom_client || "Client Details"}
          </DialogTitle>
          <DialogDescription className=' leading-tight text-base -mt-2'>
            Informations complètes sur le client et son historique des réservations.
          </DialogDescription>
          <Separator />
          
          {/* Tab Navigation */}
          <div className="w-full flex items-center justify-between rounded-md p-1 bg-rod-foreground mt-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full h-full py-1 rounded-sm flex justify-center items-center gap-2 transition-all duration-100 ${
                    activeTab === tab.id 
                      ? 'text-rod-primary bg-white font-normal' 
                      : 'text-gray-500 font-normal cursor-pointer'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className='text-base font-medium whitespace-nowrap'>{tab.label}</span> 
                </button>
              )
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
            className="w-full h-full "
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export default DetailClientModal