import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import OffersTable from './tables/offers'
import DurationsTable from './tables/durations'
import TypesTable from './tables/types'
import LieuxTable from './tables/lieux'
import CancellationsTable from './tables/cancelllations'
import { useFetchOperationsTableByType } from '../../../../api/queries/performance/operations/useFetchOperationsTableData'
import { Loader2 } from 'lucide-react'
import PromosTable from './tables/promos'


const keys = {
    offre: "Offres",
    promo: "Promotions",
    duree : "Durées de location",
    lieu : "Lieux de location",
    Type: "Types Véhicules",
    echec: "Échecs de demandes",
}
  

const TableOperations = ({DataKey , setDataKey , debut , fin}) => {
    const [open , setOpen] = React.useState(false);

    // Fetch data based on selected table type
    const { data, isLoading, isError } = useFetchOperationsTableByType(DataKey, {
        date_debut: debut,
        date_fin: fin
    });

    console.log(data)

    const renderTable = () => {
        switch (DataKey) {
            case "offre":
                return (
                    <OffersTable data={data} />
                )
            case "promo":
                return (
                    <PromosTable data={data} />
                )
            case "duree":
                return (
                    <DurationsTable data={data} />
                )
            case "lieu":
                return (
                    <LieuxTable data={data} />
                )
            case "Type":
                return (
                   <TypesTable data={data} />
                )
            case "echec":
                return (
                    <CancellationsTable data={data} />
                )
            default:
                return null;
        }
    }
  
  return (
    <Card className="pt-0 h-full w-full">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle onClick={()=> setOpen(true)} className="flex  items-center ">
            

             <Select open={open} onOpenChange={setOpen} value={DataKey} onValueChange={setDataKey}>
              <SelectTrigger className="m-0 p-0 border-0 cursor-pointer space-y-0 data-[size=default]:h-fit w-fit text-base leading-tight !focus-visible:border-0 !focus-visible:ring-0 " >
                {keys[DataKey]}
                </SelectTrigger>
          <SelectContent >
            {Object.keys(keys).map((key) => (
              <SelectItem key={key} value={key}>
                {keys[key]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
          </CardTitle>
        <CardDescription>
            {DataKey === "echec" 
                ? `Raisons les plus fréquentes d'${keys[DataKey].toLowerCase()}`
                : `Les ${keys[DataKey]} les plus populaires`}
        </CardDescription>

        </div>
        
      </CardHeader>
      <CardContent className=" h-full overflow-y-auto mr-1 pr-3">
      {
        isLoading ? 
        <div className='h-full w-full flex items-center justify-center'>
          <Loader2 className='animate-spin'/>
        </div>:
        isError ?
        <div className='w-full h-full flex justify-center items-center '>
            <span className='text-destructive text-sm '>Erreur lors du chargement des données.</span>
          </div>
        :
        DataKey ?
        renderTable():
        null
      }
      </CardContent>
    </Card>
  )
}

export default TableOperations