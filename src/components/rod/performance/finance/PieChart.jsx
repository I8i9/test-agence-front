import React, { useState } from 'react'
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
import { allCosts } from '../../../../utils/costs'
import PieChartReusable from './pieCharts/PieChartReusable'
import { useFetchDurationPieChart } from '../../../../api/queries/performance/finances/useFetchFinancePieChartData'
import { CalendarDays, HandCoins, Loader2 } from 'lucide-react'

const chartConfig = {
  couts:{
    label: "Coûts",
  },
}


const chartConfig2 = {
  revenu:{
    label: "Revenu",
  },
  "1_3":{
    label: "1–3 jours",
    color: "#a5b4fc",
  },
  "4_7":{
    label: "4–7 jours",
    color: "#818cf8",
  },
  "8_14":{
    label: "8–14 jours",
    color: "#6366f1",
  },
  "15_30":{
    label: "15 jours – 1 mois",
    color: "#4f46e5",
  },
  "30_90":{
    label: "1 mois – 3 mois",
    color: "#4338ca",
  },
  "3_mois":{
    label: "+3 mois",
    color: "#3730a3",
  },
}

const orange = [
  "#fed7aa","#fdba74","#fb923c","#f97316","#ea580c"
]


const PieChartFinance = ({DataKey , setDataKey , debut , fin , depensesData , depenseLoading, depenseError }) => {

  const [open, setOpen] = useState(false); 

  const { data: durationData = [], isLoading: durationLoading, error: durationError } = useFetchDurationPieChart({
    date_debut: debut,
    date_fin: fin
  });

  // Prepare depenses chart data with colors (top 5 from backend)
  const chartDataDepenses = depensesData.map((item, index) => ({
    ...item,
    fill: orange[index % orange.length]
  }));

  // Prepare depenses chart config dynamically
  const chartConfigDepenses = {
    ...chartConfig,
    ...depensesData.reduce((acc, item, index) => {
      acc[item.type] = {
        label: allCosts.find(cost => cost.value === item.type)?.label || item.type,
        color: orange[index % orange.length],
      };
      return acc;
    }, {}),
  };

  // Prepare duration chart config dynamically based on actual data
  const chartDataReady = durationData?.map(item => ({
    ...item,
    fill: chartConfig2[item.type]?.color
  }));
  
  return (
    <Card className="pt-0 h-full w-full  ">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle onClick={()=> setOpen(true)}  className="flex  items-center ">
            <Select open={open} onOpenChange={setOpen} value={DataKey} onValueChange={setDataKey}>
                          <SelectTrigger className="m-0 p-0 border-0 cursor-pointer space-y-0 data-[size=default]:h-fit w-fit text-base leading-tight !focus-visible:border-0 !focus-visible:ring-0 " >
                            {DataKey === 'depense' ? "Dépenses" : DataKey === 'duree' ? "Durée de Location" : ""}
                            </SelectTrigger>
                      <SelectContent >
                        <SelectItem value="duree">Durée de Location</SelectItem>
                        <SelectItem value="depense">Dépenses</SelectItem>



                      </SelectContent>
            </Select>
          </CardTitle>
        <CardDescription>
            Les {DataKey === 'depense' ? "Dépenses" : DataKey === 'duree' ? "Durée de Location" : ""} les plus {DataKey === "depense" ? "occurentes" : "fréquentes"}.
        </CardDescription>

        </div>
      </CardHeader>
      <CardContent className=" h-full w-full  flex justify-center items-center ">
        {
          DataKey === 'depense' ? (
              depenseLoading ? 
                <div className='w-full h-full flex justify-center items-center '>
                  <Loader2 className="animate-spin size-6 " />
                </div>
              : depenseError ?
                <div className='w-full h-full flex justify-center items-center '>
                  <span className='text-destructive text-sm '>Erreur lors du chargement des données.</span>
                </div>
              : (!depensesData || depensesData?.length===0) ?
                <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                    <span className='p-2 bg-rod-foreground rounded-full'><HandCoins className='size-5'/></span>
                    <span className='text-sm font-medium text-gray-800'>Pas de dépenses pour cette periode</span>
                </div>
              : chartDataDepenses ?
               <div className='h-fit w-full flex-1 min-h-0 overflow-hidden'>
                  <PieChartReusable dataKey="couts" nameKey="type" suffix="DT" chartConfig={chartConfigDepenses} chartData={chartDataDepenses} />
                </div>
              : null
          )
          : (

                durationLoading ?
                    <div className='w-full h-full flex justify-center items-center '>
                      <Loader2 className="animate-spin size-6 " />
                    </div>
                    : durationError ?
                    <div className='w-full h-full flex justify-center items-center '>
                      <span className='text-destructive text-sm '>Erreur lors du chargement des données.</span>
                    </div>
                    :
                    (!durationData || durationData?.length===0) ?
                      <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                          <span className='p-2 bg-rod-foreground rounded-full'><CalendarDays className='size-5'/></span>
                          <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
                      </div>
                    : 
                    <div className='h-fit w-full flex-1 min-h-0 overflow-hidden'>
                        <PieChartReusable dataKey="revenu" nameKey="type" suffix="DT" chartConfig={chartConfig2} chartData={chartDataReady} />
                    </div>
            )
        }
      </CardContent>
    </Card>
  )
}

export default PieChartFinance