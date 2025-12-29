import React from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import { GitCommitHorizontal, Loader2 } from 'lucide-react'
import { useFetchFinanceChartByMetric } from '../../../../api/queries/performance/finances/useFetchFinanceChartData'

const chartConfig = {
  revenu: {
    label: "Revenu",
    color: "#10b981",  // green-500
    stroke: "#16a34a", // green-600
  }, 
  depense: {
    label: "Dépenses",
    color: "#f97316",  // orange-500
    stroke: "#ea580c", // orange-600
  },
  brut: {
    label: "Marge Brute",
    color: "#3b82f6",  // blue-500
    stroke: "#2563eb", // blue-600

  },
  taux_brut: {
    label: "Taux de Marge Brute",
    color: "#c084fc",  // fuchasia-500
    stroke: "#a855f7", // fuchasia-600

  },
}

const keys = [
    "revenu&depense",
    "revenu", 
    "depense",
    "brut",
    "taux_brut",
]   

const AreaChartFinance = ({DataKey , setDataKey , debut, fin}) => {

  const { data, isLoading, isError } = useFetchFinanceChartByMetric(DataKey, { debut, fin });

  const chartData = DataKey === "revenu&depense" 
    ? data || []  // For combined, use data as-is (has both revenu and depense)
    : data?.map(item => ({
        date: item.date,
        [DataKey]: item.value
      })) || [];

  return (
    <Card className="pt-0 h-full w-full ">
      <CardHeader className="flex items-start gap-2 space-y-0  py-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle>Performance Financière</CardTitle>
          <CardDescription>
            Aperçu des performances financières d'agence au fil du temps.
          </CardDescription>
        </div>
        <Select value={DataKey} onValueChange={setDataKey}>
          <SelectTrigger
            className=" w-[220px] relative  pl-9"
            aria-label="Choisir le metrique à afficher"
          >
            <div className={` absolute inset-y-0 left-0 flex items-center justify-center pl-3`}>
              <GitCommitHorizontal stroke={chartConfig[DataKey]?.color || "#18181b"} />
            </div>
            <SelectValue  placeholder="Choisir le metrique à afficher" />
          </SelectTrigger>
          <SelectContent >
            {keys.map((key) => (
              <SelectItem key={key} value={key}>
                
                {chartConfig[key]?.label || "Revenu & Dépenses"}
              </SelectItem>
            ))}
            
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 h-full min-h-0">
        {
         isLoading ? 
          <div className='w-full h-full flex justify-center items-center '>
            <Loader2 className="animate-spin size-6 " />
          </div>
          : isError ?
          <div className='w-full h-full flex justify-center items-center '>
            <span className='text-destructive text-sm '>Erreur lors du chargement des données.</span>
          </div>
          :

          DataKey === "revenu&depense" ?

            <ChartContainer
          config={chartConfig}
          className="aspect-auto h-full w-full min-h-0"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`fillrevenu`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig["revenu"].color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig["revenu"].color}
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="filldepense" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig["depense"].color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig["depense"].color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            
            </defs>
            <CartesianGrid vertical={false} />
            
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("fr-FR", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              // Force the domain to [0, 100] for percentage metrics
              domain={DataKey.includes("taux") ? [0, 100] : [0, 'auto']}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
              suffix={
                DataKey.includes("taux") ? "%" : "DT"
              }

            />
           
            <Area
              key={"revenu&"}
              dataKey={"revenu"}
              type="monotone"
              fill={`url(#fillrevenu)`}
              stroke={chartConfig["revenu"].stroke}
              stackId="a"
              
            />

            <Area
              key={"depense&"}
              dataKey={"depense"}
              type="monotone"
              fill={`url(#filldepense)`}
              stroke={chartConfig["depense"].stroke}
              stackId="b"
              
            />
            <ChartLegend content={<ChartLegendContent  />} />
          </AreaChart>
            </ChartContainer> 

            :

            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-full w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`fill${DataKey}`} x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfig[DataKey].color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig[DataKey].color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                
                </defs>
                <CartesianGrid vertical={false} />
                
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                />

                <YAxis
                  dataKey={DataKey}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  
                />
                <ChartTooltip
                  cursor={true}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("fr-FR", {
                          month: "short",
                          day: "numeric",
                        })
                      }}
                      indicator="dot"
                    />
                  }
                  suffix={
                    DataKey.includes("taux") ? "%" : "DT"
                  }

                />
              
                <Area
                  key={DataKey}
                  dataKey={DataKey}
                  type="monotone"
                  fill={`url(#fill${DataKey})`}
                  stroke={chartConfig[DataKey].stroke}
                  stackId="a"
                  
                />
                <ChartLegend content={<ChartLegendContent  />} />
              </AreaChart>
            </ChartContainer>
            
        }

      </CardContent>
    </Card>
  )
}

export default AreaChartFinance