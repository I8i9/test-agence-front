import { Separator } from "@/components/ui/separator";
import { ReceiptText, ReceiptIcon, ArrowRight, } from 'lucide-react';
import { useFetchClientContrats } from "../../../api/queries/client/useFetchContratClient";
import { differenceInDays } from 'date-fns';
import { contractsStyles } from "../../../utils/contracts";
import {Badge} from "@/components/ui/badge";
import { Skeleton } from "../../ui/skeleton";
import { formatDateDDMMYYYYHHMM } from "../../../utils/dateConverter";

const ClientHistoriqueSkeleton = () => {
  return (
    <div key={"history-contracts-skeleton"} className={`space-y-3  py-2 flex-1`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="border rounded-lg p-2 ">
          {/* Header with client info and status */}
          <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full">
            </Skeleton>
            <div>

              <Skeleton className="font-medium h-4.5 w-32 "/>
              <div className="flex items-center  gap-3 mt-2">
                
                
               <Skeleton className="h-4 w-32"></Skeleton>
               <Skeleton className="h-4 w-32"></Skeleton>
               <Skeleton className="h-4 w-32"></Skeleton>

                
              </div>
              
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className={`h-5 w-20`}>
            </Skeleton>
            <Skeleton className="w-28 h-5"/>
          </div>
        </div>

        {/* Contract Details Grid */}
        <div className="flex items-center gap-12 px-2 pb-2 text-base">
          {/* Period */}
          <div>
              <Skeleton className=" mb-1 invisible h-4 w-20"/>
              <div className="space-y-1">
                <Skeleton className="h-4 w-32"/>
                <Skeleton className="h-4 w-40"/>
              </div>
          </div>

          {/* Location */}
          <div>
             <Skeleton className=" mb-1 invisible h-4 w-20"/>
              <div className="space-y-1">
                <Skeleton className="h-4 w-32"/>
                <Skeleton className="h-4 w-40"/>
              </div>
          </div>

          {/* Tariff */}
          <div>
             <Skeleton className=" mb-1 invisible h-4 w-20"/>
              <div className="space-y-1">
                <Skeleton className="h-4 w-32"/>
                <Skeleton className="h-4 w-40"/>
              </div>
          </div>
        </div>
      </div>
    ))}
  </div>
  );
}

const ClientHistoriqueTab = ({ ClientId }) => {
  // Fetch real data using the custom hook
  const { data : contractss, isLoading : isLoadingHistorique,isError } = useFetchClientContrats(ClientId);

  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-red-500">Erreur lors du chargement des contrats</div>
      </div>
    );
  }

  // Calculate total contracts
  const totalContracts = contractss?.length || 0; 
  const totalAmount = contractss?.reduce((sum, contract) => contract?.status !== "ANNULE" ? sum + contract.amount : sum, 0) || 0;

  // Handle empty state
  if (totalContracts === 0 && !isLoadingHistorique) {
    return (
     <div className="h-full w-full flex flex-col items-center justify-center gap-2">

          <span className="p-3 rounded-xl bg-rod-foreground mb-1">
           <ReceiptText className="w-8 h-8  mx-auto " />
          </span>
          <p className="text-xl font-semibold">Aucun contrat enregistrée</p>
          <p className="text-gray-500 text-lg leading-none"> Une fois un contrat ajouté, il s'affichera ici.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Contracts List */}

      {
          isLoadingHistorique ? <ClientHistoriqueSkeleton />
          :
        <div key={"history-contracts"} className={`space-y-3  py-2  overflow-y-auto h-[427px]`}>
          {/* show the contracts */}
          {contractss.map((contract) => {

          const days = differenceInDays(
            new Date(contract.period.end),
            new Date(contract.period.start)
          );
          return (
          <div key={contract.id} className="border rounded-lg p-2 h-18 hover:bg-rod-foreground ">
            {/* Header with client info and status */}
            <div className="flex items-start justify-between ">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <ReceiptText className=" text-blue-700" />
                </div>
                <div>
                  
                  <p className="font-medium text-lg ">{contract.sequenceContrat}</p>
                  <div className="flex items-center text-base gap-3 text-gray-500">
                    {/* Display client email and phone */}
                    
                    <span>
                      {contract.phone}
                    </span>
                    • 
                    <div className="flex gap-1 items-center">

                    <span>
                      {formatDateDDMMYYYYHHMM(contract.period.start)}
                    </span>

                    <ArrowRight className="w-4 h-4"/>
                    <span>
                      {formatDateDDMMYYYYHHMM(contract.period.end)}
                    </span>

                    </div>
                    • 
                    <span>
                      { days }
                      { days > 1 ? " jours" : " jour"}
                    </span>

                    
                  </div>
                  
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Badge className={`text-xs font-medium   ${contractsStyles[contract.status].style}`}>
                  {contractsStyles[contract.status].label}
                </Badge>
                <span className="font-bold text-base mt-1">{parseFloat(contract.amount.toFixed(3))} DT</span>
              </div>
            </div>

          </div>
          )
          })}
      </div>
      }

      {/* Total Section - Fixed at bottom */}
      {!isLoadingHistorique &&
      <div key={"history-total"} className="flex-shrink-0">
        <div className="mb-4">
          <Separator />
        </div>
        <div className="flex justify-between  items-center px-2">
          <span className="text-xl font-medium flex items-center gap-2">
            <span className="p-2 rounded-lg bg-rod-foreground">
            <ReceiptIcon className="w-6 h-6 " />
            </span>
            <span className="font-semibold">
                          Total Contrats
            </span>

          </span>
          <span className="text-xl flex items-end flex-col gap-1   font-semibold">
            <span className="leading-none">
            {parseFloat(totalAmount.toFixed(3))} DT
            </span>
              <span className=" leading-none text-gray-500 text-base font-normal">
                ({totalContracts} {totalContracts > 1 ? "contrats" : "contrat"})
              </span>
          </span>
        </div>
      </div>

      }
    </div>
  );
};

export default ClientHistoriqueTab