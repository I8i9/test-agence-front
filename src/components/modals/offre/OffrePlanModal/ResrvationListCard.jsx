import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, MoveHorizontal, ReceiptText, FileX2, Car, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReservationCardSkeleton from "./ListReservationsSkeleton.jsx";
import { useEffect, useRef } from "react";
import { formatDateDDMMYYYYHHMM } from "../../../../utils/dateConverter.js";

const ResevationListCard = ({ data, selectedcontract, selectContract, isLoading, isError }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "En Cours":
        return "bg-green-100 text-green-600";
      case "Planifiée":
        return "bg-blue-100 text-blue-600";
      case "Terminée":
        return "bg-red-100 text-red-500"
    }
  };

  const scrolledRef = useRef(false);

  const refs= useRef([]);

  useEffect(() => {
    // select the index of the first  en cours contract by default
    if (data && data.length > 0 && !isLoading && !isError && !scrolledRef.current) {
      let firstContract = data.find(c => c.status === "En Cours");
      // if no en cours contract, select the first one to start on the future
      if (!firstContract) {
        firstContract = data.find(c => c.status === "Planifiée");
      }
      if (firstContract) {  
        refs.current[firstContract.id_contrat]?.scrollIntoView({ behavior: "smooth" });
        scrolledRef.current = true;
      }
        // scroll to the selected contract id by using key 

    }
  }, [data]);

  return (
    <Card className="shadow-none min-w-[460px] w-fit">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-3 font-medium ">
          <CalendarDays className="w-5 h-5 mb-0.5" />
         Contrats réservés pour cette offre
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="w-full h-[424px]  overflow-y-auto no-scrollbar">
          <div className="h-full flex flex-col gap-4">
            {isLoading ? (
              <>  
                <ReservationCardSkeleton />
                <ReservationCardSkeleton />
                <ReservationCardSkeleton />
                <ReservationCardSkeleton/>
              </>
            ) : 

            isError ?
            (
            <div className="flex h-full flex-col items-center gap-2 w-[411px] justify-center text-center mb-10">
                
                
                <span className=' text-base text-destructive'>Erreur lors du chargement des réservationsx</span>
            </div>
            ):
            data?.length === 0 ? (
            <div className="flex h-full flex-col items-center gap-2 w-[411px] justify-center text-center mb-10">
                
                <span className='p-2 bg-rod-foreground rounded-full' >
                  <CalendarX className='w-7 h-7 text-rod-primary' />
                </span>
                <span className='text-gray-600 text-base'>Aucune réservation pour cette offre</span>
            </div>
            ) : (
              data.map((c) => {

                return (
                  <Card
                    ref = {el => refs.current[c.id_contrat] = el}
                    key={c.id_contrat}
                    className={`cursor-pointer border-box border-2 hover:bg-gray-50 transition-all duration-400 py-4 shadow-none w-full ${
                      c.id_contrat === selectedcontract
                        ? "border-2  border-rod-primary"
                        : "hover:border-gray-300"
                    }`}
                    onClick={() => selectContract(c)}
                  >
            <CardContent className="px-4 space-y-3">
              <div className="flex justify-between items-start">     
                    <div className="flex flex-col items-start gap-0.5">
                            <span className="text-lg font-semibold text-rod-primary flex items-center leading-tight">
                              {c.sequence}
                            </span>
                            <span className="text-base font-normal text-gray-500 leading-tight">
                              {c.client}
                            </span>
                    </div>
                  <div className="flex flex-col items-end gap-1.5">
                          <Badge className={`${getStatusColor(c.status)} text-sm px-1.25 py-1 leading-none`}>
                            {c.status}
                          </Badge>
                         <span className="text-lg font-semibold text-rod-primary flex items-center leading-tight">
                              {c.prix} DT
                            </span>
                        </div>
                  </div>
                  <div className="flex flex-col gap-0.5 items-start">
                      <div className="flex items-center gap-1.5 whitespace-nowrap text-base text-gray-700 font-normal">
                          <span className="font- ">
                            {formatDateDDMMYYYYHHMM(c.debut)}
                          </span>
                          <MoveHorizontal className="size-4 text-gray-400" />
                          <span className="font- ">
                            {formatDateDDMMYYYYHHMM(c.fin)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className=" text-base font-">
                                {c?.duration} Jours
                          </span>
                    </div>  
                  </div>
            </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResevationListCard;