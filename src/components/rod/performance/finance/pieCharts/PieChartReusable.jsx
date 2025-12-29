import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"

export const CustomTooltip = ({chartConfig, active, payload, dataKey , nameKey }) => {
  if (!active || !payload || !payload.length) return null
  
  const data = payload[0].payload
  const value = data[dataKey]
  const type = data[nameKey]
  const suffix = dataKey?.includes("taux") ? "%" : "DT"
  console.log("dataKey", data , type , nameKey)
  console.log("chartConfig", chartConfig)
  
  return (
    <div className="rounded-lg border overflow-hidden flex flex-col gap-1 bg-background p-2 shadow-xs">
          <span className="text-xs font-medium">
            {chartConfig[type]?.label }
          </span>
          <span className=" text-foreground flex gap-3">
            <span className='flex gap-2   items-center text-muted-foreground'>
              <span className='size-3 rounded-xs' style={{backgroundColor: chartConfig[type].color}}></span><span className='leading-none'>{chartConfig[dataKey]?.label}</span></span> <span>{value}{suffix}</span>
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

const PieChartReusable = ({chartConfig, chartData , dataKey , nameKey  }) => {
  return (
     <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto  aspect-square max-h-[310px] desktop-lg:max-h-[350px] "
        >
          <PieChart className="*:overflow-visible">
            <ChartTooltip
              content={<CustomTooltip chartConfig={chartConfig} dataKey={dataKey} nameKey={nameKey} hideLabel />}
            />
            <Pie  innerRadius={70}
              strokeWidth={5} key={dataKey} data={chartData} dataKey={dataKey} 
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
                      {payload[dataKey]} DT
                    </text>
                  )
                }}

            >
            
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey} />}
              className="-translate-y-2 mt-2 desktop-lg:mt-6 h-[60px] flex-wrap gap-2  *:justify-center"
            />
          </PieChart>
        </ChartContainer>
  )
}

export default PieChartReusable