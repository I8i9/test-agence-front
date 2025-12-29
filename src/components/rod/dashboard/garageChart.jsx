
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"


import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"


const chartConfig = {
  disponible: {
    label: "Disponible / Publié",
    color: "var(--color-rod-foreground)",
  },
  en_location: {
    label: "En Location",
    color: "var(--color-rod-primary)",
  },
  en_panne: {
    label: "En Panne",
    color: "var(--color-rod-accent)",
  },
}

const GarageChart = ({data}) => {
const chartData = [

  { type: "en_location", value: data.en_location, fill: "var(--color-rod-primary)" },
  { type: "en_panne", value: data.en_panne, fill: "var(--color-rod-accent)" },
  { type: "disponible", value: data.disponible, fill: "var(--color-rod-foreground)" },
]

  const total = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[170px] desktop:max-h-[200px] desktop-lg:max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="type"
              innerRadius="65%"
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground  text-2xl desktop:text-3xl desktop-lg:text-4xl font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground  text-sm desktop:text-sm desktop-lg:text-sm"
                        >
                          {total > 1 ? "Véhicules" : "Véhicule"}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
  )
}
export default GarageChart