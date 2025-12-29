
import * as React from "react"
import { Label, Pie, PieChart } from "recharts"


import {
  ChartContainer,
} from "@/components/ui/chart"


const chartConfig = {
    none: {
    label: "Aucun Véhicule",
  },
}

const NoCarChart = () => {
const chartData = [

  { type: "none", value: 1, fill: "#FFFFFF" },
]


  return (
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-h-[170px] desktop:max-h-[200px] desktop-lg:max-h-[250px]"
        >
          <PieChart>
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
                          className="fill-foreground  text-lg desktop:text-xl desktop-lg:text-2xl font-bold"
                        >
                          {"Aucun Véhicule"}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground  text-sm desktop:text-sm desktop-lg:text-sm"
                        >
                          {"dans votre garage"}
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
export default NoCarChart