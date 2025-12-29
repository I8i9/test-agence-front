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
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis } from "recharts"
import { useFetchFinanceRadarByType } from '../../../../api/queries/performance/finances/useFetchFinanceRadarData'
import { CalendarDays, CircleDollarSign, Loader2 } from 'lucide-react'

import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts"
import { ChartTooltipContent } from '../../../ui/chart'


const keys = {
    revenu : "Revenu",
    depense : "Dépenses",
    brut : "Marge Brute",
    taux_brut : "Taux de Marge Brute",
}

const chartConfig = {
  revenu: {
    label: "Revenu",
    color: "#10b981",
    stroke: "#16a34a",
  },
  depense: {
    label: "Dépenses",
    color: "#f97316",
    stroke: "#ea580c",
  },
  brut: {
    label: "Marge Brute",
    color: "#3b82f6",
    stroke: "#2563eb",
  },
  taux_brut: {
    label: "Taux de Marge Brute",
    color: "#c084fc",
    stroke: "#a855f7",
  },
}


const CustomTooltip = ({ active, payload, dataKey }) => {
  if (!active || !payload || !payload.length) return null
  
  const data = payload[0].payload
  const value = data[dataKey]
  const suffix = dataKey.includes("taux") ? "%" : "DT"
  
  return (
    <div className="rounded-lg border flex flex-col gap-1 bg-background p-2 shadow-xs">
          <span className="text-xs font-medium">
            {data.type}
          </span>
          <span className=" text-foreground flex gap-3">
            <span className='flex gap-2   items-center text-muted-foreground'>
              <span className='size-3 rounded-xs' style={{backgroundColor: chartConfig[dataKey].color}}></span><span className='leading-none'>{chartConfig[dataKey].label}</span></span> <span>{value}{suffix}</span>
          </span>
           {dataKey === 'revenu' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className=" text-foreground flex gap-3">
            <span className='flex gap-2   items-center text-muted-foreground'>
              <span className='size-3 rounded-xs' style={{backgroundColor: "#3f3f46"}}></span><span className='leading-none'>Contrats</span></span> <span>{data?.nbre_contrats}</span>
          </span>
          </div>
        )}
        {dataKey === 'depense' && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className=" text-foreground flex gap-3">
            <span className='flex gap-2   items-center text-muted-foreground'>
              <span className='size-3 rounded-xs' style={{backgroundColor: "#44403c"}}></span><span className='leading-none'>Occurences</span></span> <span>{data?.nbre_depenses}</span>
          </span>
          </div>
        )}
       
    </div>
  )
}
  
const TypeFinance = ({DataKey , setDataKey , debut , fin}) => {
    const [open , setOpen] = React.useState(false);

    // Fetch radar chart data based on selected data key
    const { data: Data = [], isLoading, isError } = useFetchFinanceRadarByType(DataKey, {
      date_debut: debut,
      date_fin: fin
    });

    // Transform data to match the expected format for the chart
  const chartData = React.useMemo(() => {
    if (!Data || Data.length === 0) return [];
    
    return Data.map(item => {
      // The API returns different property names based on the data type
      // revenu endpoint returns: { type, revenu }
      // depense endpoint returns: { type, depense }
      // brut endpoint returns: { type, margeBrute }
      // taux_brut endpoint returns: { type, tauxMargeBrute }
      
      const value = item.revenu || item.depense || item.margeBrute || item.tauxMargeBrute || 0;
      
      return {
        type: item.type,
        [DataKey]: value,
        // Keep original values for potential future use
        ...item
      };
    });
  }, [Data, DataKey]);

  console.log("chartData",chartData)

  return (
    <Card className="pt-0 h-full w-full ">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5">
        <div className="grid flex-1 gap-1">
          <CardTitle onClick={()=> setOpen(true)} className="flex items-center ">
            
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
            Aperçu des {keys[DataKey]} par Type.
        </CardDescription>
        </div>
        
      </CardHeader>
      <CardContent className=" h-full">
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
        DataKey === "revenu" || DataKey === "depense" ?
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square mt-2 max-h-[320px]"
            >
              <RadarChart  className='*:overflow-visible' key={`radar-${DataKey}`} data={chartData} outerRadius="75%">
                <ChartTooltip 
                  cursor={false} 
                  content={<CustomTooltip dataKey={DataKey} />} 
                />
                <PolarAngleAxis dataKey="type" />
                <PolarGrid />
                <Radar
                  dataKey={DataKey}
                  fill={chartConfig[DataKey]?.color }
                  stroke={chartConfig[DataKey]?.stroke }
                  fillOpacity={0.6}
                  dot={{
                    r: 4,
                    fillOpacity: 1,
                  }}
                />
              </RadarChart>
            </ChartContainer>
          : DataKey === "brut" || DataKey === "taux_brut" ?
                  ((DataKey === "brut" && chartData.every(item => item.brut === 0))) || (DataKey === "taux_brut" && chartData.every(item => item.taux_brut === 0)) ?
                      <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                        <span className='p-2 bg-rod-foreground rounded-full'><CircleDollarSign className='size-5'/></span>
                        <span className='text-sm font-medium text-gray-800'>Pas d'informations pour cette periode</span>
                      </div>
                  :
                  <div className='w-full h-full flex-1 flex items-center justify-center'>
                   <ChartContainer className="w-full" config={chartConfig}>
                    <BarChart className='*:overflow-visible' accessibilityLayer data={chartData}>
                      <XAxis dataKey="type" hide />
                      <CartesianGrid vertical={false} />
                      <ChartTooltip
                        cursor={true}
                        content={<ChartTooltipContent  indicator="line" fill={chartConfig[DataKey]?.stroke} suffix={DataKey.includes("taux") ? "%" : "DT"}  />}
                      />
                      <Bar  dataKey={DataKey} radius={6} fill={chartConfig[DataKey]?.stroke}>
                        <LabelList position="top" offset={10} dataKey={"type"} formatter={(label) => label.slice(0,4)} fillOpacity={1} fontSize={12}  />
                       
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
          : null
        } 
      </CardContent>
    </Card>
  )
}

export default TypeFinance