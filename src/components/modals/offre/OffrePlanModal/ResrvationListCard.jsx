import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarDays, MoveHorizontal, ReceiptText, FileX2, Car, CalendarX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReservationCardSkeleton from "./ListReservationsSkeleton.jsx";
import { format } from "date-fns";

const ResevationListCard = ({ data, selectedcontract, selectContract, isLoading, isError }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "En Cours":
        return "bg-green-100 text-green-600";
      case "Planifié":
        return "bg-blue-100 text-blue-600";
      case "Terminée":
        return "bg-red-100 text-red-500"
    }
  };

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
            ) : isError || data.length === 0 ? (
            <div className="flex h-full flex-col items-center gap-2 w-[411px] justify-center text-center mb-10">
                
                <span className='p-2 bg-rod-foreground rounded-full' >
                  <CalendarX className='w-7 h-7 text-rod-primary' />
                </span>
                <span className='text-gray-600 text-base'>Aucune réservation pour cette offre</span>
            </div>
            ) : (
              data.map((c) => {
                const duration = Math.ceil(
                  (new Date(c.fin) - new Date(c.debut)) / (1000 * 60 * 60 * 24)
                );

                return (
                  <Card
                    key={c.sequence}
                    className={`cursor-pointer border-box border-2 hover:bg-gray-50 transition-all duration-400 py-4 shadow-none w-full ${
                      c.sequence === selectedcontract
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
                            {format(new Date(c.debut), "dd-MM-yyyy HH'h'mm")}
                          </span>
                          <MoveHorizontal className="size-4 text-gray-400" />
                          <span className="font- ">
                            {format(new Date(c.fin), "dd-MM-yyyy HH'h'mm")}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className=" text-base font-">
                                {duration} Jours
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