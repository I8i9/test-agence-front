import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartTooltipContent } from '../../../ui/chart'
import { Loader2, Users } from 'lucide-react'


const chartConfig = {
  nbre: {
    label: "Nombre de Clients",
    color: "#10b981",
    stroke: "#16a34a",
  },
  FACEBOOK  :{
    label: "Facebook",
    color: "#a5b4fc",
  },
    INSTAGRAM:{
    label: "Instagram",
    color: "#818cf8",
    },
    GOOGLE:{
    label: "Organique",
    color: "#6366f1",
    },
    FRIEND:{
    label: "Recommandation",
    color: "#4f46e5",
    },
    SAAS:{
    label: "Agence",
    color: "#4338ca",
    },
} 

  

const Sources = ({ data , loading, error}) => {
  
  return (
    <Card className="pt-0 h-full w-full">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5">
        <div className="grid flex-1 gap-1">
          <CardTitle className="flex items-center ">
            Sources des Clients
            
          </CardTitle>
        <CardDescription>
            Aperçu des Sources des Clients.
        </CardDescription>
        </div>
        
      </CardHeader>
      <CardContent className="h-full w-full  flex justify-center items-center  ">
        
         {
          loading ?
          <div className='flex justify-center items-center h-full w-full  '>
            <Loader2 className="animate-spin size-6" />
          </div>
          : error ?
          <div className='flex justify-center items-center h-full w-full '>
            <span className='text-destructive text-sm'>Erreur de chargement des données.</span>
          </div>
        :
         (!data || data?.length===0) ?
            <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
                <span className='p-2 bg-rod-foreground rounded-full'><Users className='size-5'/></span>
                <span className='text-sm font-medium text-gray-800'>Pas des clients pour cette periode</span>
              </div>
        :
        <div className='w-full h-fit '>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square mt-2 max-h-[320px]  "
        >
          <RadarChart className='*:overflow-visible' key={`radar-Sources`} data={data} outerRadius="75%">
            <ChartTooltip 
            
              cursor={false} 
              content={<ChartTooltipContent dataKey={"nbre"} />} 
            />
            <PolarAngleAxis  dataKey="type"  tickFormatter={(value) => chartConfig[value]?.label || value} />
            <PolarGrid  />
            <Radar
              dataKey={"nbre"}
              fill={chartConfig["nbre"]?.color }
              stroke={chartConfig["nbre"]?.stroke }
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
        </div>
      }
      </CardContent>
    </Card>
  )
}

export default Sources