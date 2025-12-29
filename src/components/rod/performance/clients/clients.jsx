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
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"
import { Loader2, Users } from 'lucide-react'

const chartConfig = {
  revenu:{
    label: "Revenu",
  },
    "INDIVIDUAL":{
    label: "Particulier",
    color: "#fbbf24",
    },
    "COMPANY":{
    label: "Entreprise",
    color: "#f59e0b",
    },
} 
const bleu_a_la_mode = [
  "#fbbf24", "#f59e0b"
]
const Clients = ({data, loading, error}) => {

  console.log("data clients",data)

  const chartData_ala_mode = (data ?? []).map((item, index) => ({
    ...item,
    fill: bleu_a_la_mode[index % bleu_a_la_mode.length]
  }));


  return (
    <Card className="pt-0 h-full w-full">
      <CardHeader className="flex items-start gap-2 space-y-0 pt-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle  className="flex  items-center ">
            Types de Clients
          </CardTitle>
        <CardDescription>
            Répartition des types de clients de l'agence.
        </CardDescription>

        </div>
        
      </CardHeader>
      <CardContent className=" h-full w-full  flex justify-center items-center ">
         {
          loading ?
          <div className='flex justify-center items-center h-full w-full '>
            <Loader2 className="animate-spin size-6" />
          </div>
          : error ?
          <div className='flex justify-center items-center h-full w-full '>
            <span className='text-destructive text-sm'>Erreur de chargement des données.</span>
          </div>
        : (!data || (data[0]?.nbre===0 && data[1]?.nbre===0)) ?
          <div className='h-full w-full flex flex-col text-gray-800 gap-1 items-center justify-center '>
            <span className='p-2 bg-rod-foreground rounded-full'><Users className='size-5'/></span>
            <span className='text-sm font-medium text-gray-800'>Pas des clients pour cette periode</span>
          </div>
        :
        <div className='h-fit w-full flex-1 min-h-0'>
            <ChartContainer
                      config={chartConfig}
                      className="[&_.recharts-text]:fill-background mx-auto  aspect-square max-h-[310px] desktop-lg:max-h-[350px] "
                    >
                      <PieChart className='*:overflow-visible'>
                        <ChartTooltip
                          content={<ChartTooltipContent nameKey={"type"} suffix={"DT"} hideLabel />}
                        />
                        <Pie  innerRadius={70}
                          strokeWidth={5} key={"revenu"} data={chartData_ala_mode} dataKey={"revenu"} 
                            labelLine={false}
                            label={({ payload, ...props }) => {
                              return (
                                <text
                                  cx={props.cx}
                                  cy={props.cy}
                                  x={props.x-5}
                                  y={props.y + 5}
                                  textAnchor={props.textAnchor}
                                  fontSize={14}
                                  offset={4}
                                  fontWeight={500}
                                  dominantBaseline={props.dominantBaseline}
                                  fill="hsla(var(--foreground))"
                                >
                                  
                                  {payload["revenu"] ? payload["revenu"] + "DT" : ""}
                                </text>
                              )
                            }}
            
                        >
                        
                        </Pie>
                        <ChartLegend
                          content={<ChartLegendContent nameKey={"type"} />}
                          className="-translate-y-2 mt-2 desktop-lg:mt-6 h-[60px] flex-wrap gap-2  *:justify-center"
                        />
                      </PieChart>
                    </ChartContainer>
        </div>
      }
      </CardContent>
    </Card>
  )
}

export default Clients