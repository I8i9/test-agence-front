import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"



const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--color-rod-accent)",
  },
  expense: {
    label: "Dépenses",
    color: "var(--color-rod-primary)",
  },
} 
export function RevenueChart({chartData}) {
  return (
        <ChartContainer className="h-full w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}

              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                //tickFormatter={(value) => `${value} DT`}
                />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent suffix="DT"  />}
            />
            <Bar dataKey="expense"  fill="var(--color-rod-primary)" radius={0.5}>
              
            </Bar>
            <Bar dataKey="revenue"  fill="var(--color-rod-accent)" radius={0.5}>
             
            </Bar>
          </BarChart>
        </ChartContainer>
  )
}

  