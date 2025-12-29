import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useEffect} from 'react'
// eslint-disable-next-line no-unused-vars
import {motion} from "framer-motion"
import { BellDot, Mail, MailOpenIcon, MailPlus } from "lucide-react"
import ToolTipCustom from "../../customUi/tooltip"

const HeaderSwitch = ({table , isChecked , setIsChecked , disabled}) => {


    useEffect(() => {
        if (isChecked) {
            table.setColumnFilters((old) => [...old, { id: 'notification_demande', value: false }])
        } else {
            table.setColumnFilters((old) => old.filter(filter => filter.id !== 'notification_demande'))
        }
    }, [isChecked])

  if(disabled) return null;

  

  return (

    <motion.button animate={{ opacity: 1 }} initial={{ opacity: 0.5 }}   className="absolute  cursor-pointer top-1/2 right-3 -translate-y-1/2 flex items-center transition-all duration-200  space-x-2" onClick={() => {if(!disabled){ setIsChecked(!isChecked)} }}>

        <ToolTipCustom
    trigger={<BellDot className={`size-5 ${isChecked ? 'text-rod-accent' : 'text-gray-500'}`} /> }
     message = {isChecked ? "Afficher toutes les demandes" : "Afficher les demandes non lues"}
    />
    </motion.button>
   
   
  )
}

export default HeaderSwitch