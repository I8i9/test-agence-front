import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import PolitiquesOffreCard from "../../offre/DetailOffreModel/PolitiqueOffreCard.jsx";
import {Shield ,Settings, DollarSign} from 'lucide-react'
import OptionsOffreCard from "../../offre/DetailOffreModel/OptionsOffreCard.jsx";

function ViewOffreModal({ data,open,setOpen}) {
const [activeTab, setActiveTab] = useState(0);
console.log("data offre modal",data)



const hasOptions = data?.conducteur_add != null || data?.chauffeur != null || data?.wifi != null || data?.gps != null || data?.siege_bebe != null || data?.siege_enfant != null || data?.rehausseur != null || data?.plein_carburant != null || data?.livraison != null || data?.assurance_PR != null || data?.assurance_TR != null;

const tabs = [
    { label: 'Politique et conditions', icon: Shield },
    ...(hasOptions ? [{ label: "Options supplémentaires", icon: Settings }] : [])
]

 return ( 
    <Dialog   open={open} onOpenChange={setOpen}> 
      <DialogContent aria-describedby={undefined} className={`flex max-w-[976px] scale-85 desktop:scale-90 desktop-lg:scale-110 flex-col `}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="w-full leading-tight"> 
            Politique & Options de l'offre  {data.sequence_offre ? data.sequence_offre : ''}
          </DialogTitle>
          <Separator />
              <div className="w-full flex items-center justify-between rounded-md p-1 bg-rod-foreground mt-1">
            {tabs.map((tab,id) => {
              const IconComponent = tab.icon
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full h-full py-1 rounded-sm flex justify-center items-center gap-2 transition-all duration-200 ${
                    activeTab === id 
                      ? 'text-rod-primary bg-white font-normal' 
                      : 'text-gray-500 font-normal cursor-pointer'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mb-0.5 shrink-0" />
                  <span className='text-base font-medium whitespace-nowrap'>{tab.label}</span> 
                </button>
              )
            })}
          </div>     
        </DialogHeader>
        { activeTab === 0 ? (
            <PolitiquesOffreCard data={data} />
        ) 
          :
         (
            <OptionsOffreCard optionsData={{
              conducteur_additionnel : 
              data?.conducteur_add ?
              { 
                mode : data?.conducteur_add ,
                prix : data?.prix_options_conducteur_add
              }: null,

              chauffeur : data?.chauffeur ?  {
                mode : data?.chauffeur ,
                prix : data?.prix_total_chauffeur

              } : null ,
              wifi :
              data?.wifi ? 
              {
                mode : data?.wifi ,
                prix : data?.prix_options_wifi
              } : null,

              gps :
              data?.gps ?
              {
                mode : data?.gps ,
                prix : data?.prix_options_gps
              } : null,

              siege_bebe :
              data?.siege_bebe ?
              {
                mode : data?.siege_bebe ,
                prix : data?.prix_options_siege_bebe
              } : null,

              siege_enfant : 
                data?.siege_enfant ?
                {
                  mode : data?.siege_enfant ,
                  prix : data?.prix_options_siege_enfant
                } : null,

              rehausseur :
              data?.rehausseur ?{
                mode : data?.rehausseur ,
                prix : data?.prix_options_rehausseur
              } : null,

              plein_carburant : 
              data?.plein_carburant ? {
                mode : data?.plein_carburant ,
                prix : data?.prix_options_plein
              } : null,

              livraison :
              data?.livraison ?
              {

                mode : data?.livraison ,
                prix : data?.prix_options_livraison
              } : null ,

              assurance_PR :
              data?.assurance_PR ?
              {
                mode : data?.assurance_PR ,
                prix : data?.prix_options_assurance_PR
              } : null,

              assurance_TR : 
              data?.assurance_TR ?
              {
                mode : data?.assurance_TR ,
                prix : data?.prix_options_assurance_TR
              } : null,
            }

            } /> 
        )
        }


    </DialogContent> 
  </Dialog>
  )
}

export default ViewOffreModal