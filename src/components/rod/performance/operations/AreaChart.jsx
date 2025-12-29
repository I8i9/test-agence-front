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
import { useFetchOperationsChartByMetric } from '../../../../api/queries/performance/operations/useFetchOperationsChartData'

const chartConfig = {
  clicks: {
    label: "Vues",
    color: "#ef4444",  // red-500
    stroke: "#dc2626", // red-600
  },
  demands: {
    label: "Demandes",
    color: "#f97316",  // orange-500
    stroke: "#ea580c", // orange-600
  },
  contracts: {
    label: "Contrats",
    color: "#f59e0b",  // amber-500
    stroke: "#d97706", // amber-600
  },
  taux_de_conversion: {
    label: "Taux de Conversion",
    color: "#10b981",  // green-500
    stroke: "#16a34a", // green-600
  },
  taux_de_succes: {
    label: "Taux de Succès",
    color: "#3b82f6",  // blue-500
    stroke: "#2563eb", // blue-600
  },
  taux_d_occupence: {
    label: "Taux d'Occupation",
    color: "#8b5cf6",  // purple-500
    stroke: "#7c3aed", // purple-600
  },
}

const keys = {
    clicks: "clicks",
    demands: "demands",
    contracts: "contracts",
    taux_de_conversion: "taux_de_conversion",
    taux_de_succes: "taux_de_succes",
    taux_d_occupence: "taux_d_occupence",
}   

const AreaChartOperations = ({DataKey, setDataKey, debut, fin}) => {
  // Fetch data based on selected metric
  const { data, isLoading, isError } = useFetchOperationsChartByMetric(DataKey, { debut, fin });

  // Transform data to match chart format
  const chartData = data?.map(item => ({
    date: item.date,
    [DataKey]: item.value
  })) || [];

  return (
    <Card className="pt-0 h-full w-full ">
      <CardHeader className="flex items-start gap-2 space-y-0  py-5 ">
        <div className="grid flex-1 gap-1">
          <CardTitle>Performance Commerciale</CardTitle>
          <CardDescription>
            Aperçu des performances Commerciales d'agence au fil du temps.
          </CardDescription>
        </div>
        <Select value={DataKey} onValueChange={setDataKey}>
          <SelectTrigger
            className=" w-[210px] relative  pl-9"
            aria-label="Choisir le metrique à afficher"
          >
            <div className={` absolute inset-y-0 left-0 flex items-center justify-center pl-3`}>
              <GitCommitHorizontal stroke={chartConfig[DataKey].color} />
            </div>
            <SelectValue  placeholder="Choisir le metrique à afficher" />
          </SelectTrigger>
          <SelectContent >
            {Object.keys(keys).map((key) => (
              <SelectItem key={key} value={keys[key]}>
                {chartConfig[keys[key]].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 h-full">
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
                        year: "numeric"
                      })
                    }}
                    indicator="dot"
                  />
                }
                suffix={DataKey.includes("taux") ? "%" : ""}
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

export default AreaChartOperations