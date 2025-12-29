import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Handshake } from "lucide-react"
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "../../../../store/store" 

const DemandToast = ({  userName, carName, matricule } ) => {
  const [isExpanded, setIsExpanded] = useState(false)

  React.useEffect(() => {
    // Trigger expansion after icon appears
    const timer = setTimeout(() => {
      setIsExpanded(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className=" bg-white border shadow-lg rounded-sm overflow-hidden  "
    >

      <motion.div
        className="flex items-center relative p-3 gap-3"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.34, 1.56, 0.64, 1],
            delay: 0.1,
          }}
          className="flex-shrink-0 bg-gradient-to-br from-rod-accent to-red-600 rounded-full p-2 "
        >
          <Handshake className="w-5 h-5 text-white" />
        </motion.div>



        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ width: 0, opacity: 0, filter: "blur(10px)" }}
              animate={{ width: "470px", opacity: 1, filter: "blur(0px)" }}
              exit={{ width: 0, opacity: 0, filter: "blur(10px)" }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.46, 0.45, 0.94],
                opacity: { duration: 0.5, delay: 0.1 },
              }}
              className="overflow-hidden"
            >
            <motion.span
                initial={{ x: -30,y: -8  }}
                animate={{ x: 0 ,y: 0  }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
             className="flex flex-col bg-rod-accent rounded-full absolute right-2 top-2 size-2 gap-1"/>


              <motion.div
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="whitespace-nowrap "
              >
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-rod-accent font-semibold text-base"
                >
                Nouvelle Demande Reçue!
                </motion.p>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                  className="text-gray-900 text-sm truncate"
                >
                  <span className="text-rod-primary font-semibold">{userName}</span> souhaite louer la voiture{" "}
                  <span className="text-gray-800 font-semibold">{carName} {matricule}</span>
                </motion.p>
            
                

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}

export default function DemandNotification() {
  const socket = useStore((state) => state.socket)

  useEffect(() => {
    if (!socket) return

    // Listen for new demand notifications
    const handleNewDemand = (data) => {
      const { userName, carName, matricule } = data
      showDemandNotification(userName, carName, matricule)
    }

    socket.on('newDemand', handleNewDemand)

    // Cleanup listener on unmount
    return () => {
      socket.off('newDemand', handleNewDemand)
    }
  }, [socket])

  const showDemandNotification = (userName, carName, matricule) => {

    const audio = new Audio('/notification.mp3'); // path relative to public
    audio.play();

    toast.custom(() => <DemandToast  userName={userName} carName={carName} matricule={matricule} />, {
      duration: 4000,
    })
  } 
}
  