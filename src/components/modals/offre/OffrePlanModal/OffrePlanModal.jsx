import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useFetchreservations from '../../../../api/queries/offre/useGetreservations.js'
import ResevationListCard from './ResrvationListCard.jsx'
import {
  ChevronLeft,
  ChevronRight,

} from "lucide-react";
import { Separator } from "../../../ui/separator.jsx";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence , motion } from "framer-motion";

function OffrePlanModal({ OffreId, open, onClose,offerData}) {
  const {isLoading,data,isError} = useFetchreservations(OffreId)
  const debutOffre = new Date(offerData.date_debut_offre);
  const finOffre = new Date(offerData.date_fin_offre);
  const [currentDate, setCurrentDate] = useState(debutOffre);
  const [selectedcontract, setselectedcontract] = useState(null);



  const months = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];
  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        month: month === 0 ? 11 : month - 1,
        year: month === 0 ? year - 1 : year,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, isCurrentMonth: true, month, year });
    }

    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          day: i,
          isCurrentMonth: false,
          month: month === 11 ? 0 : month + 1,
          year: month === 11 ? year + 1 : year,
        });
      }
    }
    return days;
  };


  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const d = new Date(prev);
      d.setMonth(prev.getMonth() + direction);
      if (d < debutOffre) return debutOffre;
      if (d > finOffre) return finOffre;
      return d;
    });
  };

  const selectContract = (contract) => {
    if (contract.id_contrat === selectedcontract) {
      setselectedcontract(null);
      return;
    }
    const d = new Date(contract.debut);
    if (d < debutOffre) setCurrentDate(debutOffre);
    else if (d > finOffre) setCurrentDate(finOffre);
    else setCurrentDate(d);
    setselectedcontract(contract.id_contrat);
  };

  const days = getDaysInMonth(currentDate);

  const scrolledRef = React.useRef(false);

  useEffect(() => {
      if (data && data.length > 0 && !isLoading && !isError && !scrolledRef.current) {
      let firstContract = data.find(c => c.status === "En Cours");
      // if no en cours contract, select the first one to start on the future
      if (!firstContract) {
        firstContract = data.find(c => c.status === "Planifiée");
      }
      if (firstContract) {
        console.log("Setting date to contract debut:", firstContract.debut);
        setCurrentDate(new Date(firstContract.debut));
        scrolledRef.current = true;
      }
    }

  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-auto h-auto scale-85 desktop:scale-90 desktop-lg:scale-110  flex flex-col p-6">
        <DialogHeader>
          <DialogTitle className="w-full leading-tight">
            Planification de l’offre
          </DialogTitle>
          <DialogDescription className="leading-tight text-base -mt-2">
            Consultez ici les périodes pendant lesquelles cette offre est déjà réservée.
          </DialogDescription>
        </DialogHeader>
      <Separator/>
        <div className="flex flex-1 gap-6">
          {/* Calendar */}
          <div className="flex-1 flex flex-col h-[530px] px-4 py-4">
            <div className="flex items-center justify-between mb-4 px-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                disabled={
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) <=
                  new Date(debutOffre.getFullYear(), debutOffre.getMonth(), 1)
                }
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                disabled={
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), 1) >=
                  new Date(finOffre.getFullYear(), finOffre.getMonth(), 1)
                }
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            {/* Legend */}
            <div className="flex justify-center gap-6 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-2 bg-green-500 rounded-full"></div> En
                Cours
              </div>  
              <div className="flex items-center gap-2">
                <div className="w-6 h-2 bg-blue-500 rounded-full"></div>{" "}
                Planifiée
              </div>
                <div className="flex items-center gap-2">
                <div className="w-6 h-2 bg-red-500 rounded-full"></div>{" "}
                Terminée
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={`key${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`} animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {/* Days of week */}
              <div className="w-[560px] grid grid-cols-7 text-center bg-gray-100">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="px-1 py-1 text-xs font-medium text-gray-600 border-gray-200"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar days */}
              <div className="rounded-b-md overflow-visible w-[560px] h-[385px] border grid grid-cols-7 grid-rows-6 -m-px">
                {days.map((item, index) => {
                  const dayDate = new Date(item.year, item.month, item.day);
                  const dayTime = dayDate.setHours(0, 0, 0, 0);
                  
                  // Find all contracts for this day and sort them
                  const contractsForDay = data ? data.filter(c => {
                    const startTime = new Date(c.debut).setHours(0, 0, 0, 0);
                    const endTime = new Date(c.fin).setHours(0, 0, 0, 0);
                    return dayTime >= startTime && dayTime <= endTime;
                  }).sort((a, b) => a.sequence.localeCompare(b.sequence)) : [];

                  return (
                    <div
                      key={index}
                      className={`h-full w-full flex flex-col justify-between border-1 relative ${
                        !item.isCurrentMonth ? "text-gray-400" : "text-gray-800"
                      }`}
                    >
                      <span className="pl-1 pt-1">{item.day}</span>
                      {contractsForDay.map((c, contractIndex) => {
                        const startTime = new Date(c.debut).setHours(0, 0, 0, 0);
                        
                        // Calculate bottom position based on contract index - keep consistent positioning
                        let bottomPosition = 0;
                        if (contractsForDay.length > 1) {
                          // alternate padding should always put the ned above the start on new 
                          bottomPosition = contractIndex % 2 !== 0 ? 0 : 22;
                        } 

                        const isStacked = contractsForDay.length > 1 && contractIndex % 2 === 0 ;

                        return (
                          <div
                            key={contractIndex}
                            className="flex flex-col items-center h-full gap-1"
                          >
                            <div
                              className={` flex items-center justify-center rounded-full absolute transition-all duration-300 ease-in  
                              ${
                                 dayTime === startTime ? "w-16 h-5 mb-1.5" : isStacked ? 'w-14 h-1.5  mb-2' : " w-14 h-2 mb-3"
                              }
                              ${
                                selectedcontract === c.id_contrat
                                  ? `${c.status === "En Cours" ? "bg-green-500 ring-2 ring-green-200 ring-offset-1" : c.status === "Planifiée" ? "bg-blue-500 ring-2 ring-blue-200 ring-offset-1" : "bg-red-500 ring-2 ring-red-200 ring-offset-1"}  scale-[1.10] z-50`
                                  : `${c.status === "En Cours" ? "bg-green-500" : c.status === "Planifiée" ? "bg-blue-500" : "bg-red-500"} scale-[1.01] z-40`
                              }`}
                              style={{ bottom: `${bottomPosition}px` }}
                            >
                              <span className="text-xs font-medium text-white text-">
                                {dayTime === startTime ? c.sequence : null}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Contracts list */}
        <ResevationListCard isError={isError} data={data} selectedcontract={selectedcontract} selectContract={selectContract} isLoading={isLoading}/>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default OffrePlanModal;