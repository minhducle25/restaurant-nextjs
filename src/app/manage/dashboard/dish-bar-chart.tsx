"use client";

import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";

const colors = [
  "var(--color-chrome)",
  "var(--color-safari)",
  "var(--color-firefox)",
  "var(--color-edge)",
  "var(--color-other)",
];

const chartConfig = {
  successOrders: {
    label: "Đơn thanh toán",
  },
  chrome: {
    label: "Chrome",
    color: "oklch(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "oklch(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "oklch(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "oklch(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "oklch(var(--chart-5))",
  },
} satisfies ChartConfig;

const chartData = [
  { name: "chrome", successOrders: 275, fill: "oklch(var(--chart-1))" },
  { name: "safari", successOrders: 200, fill: "oklch(var(--chart-2))" },
  { name: "firefox", successOrders: 187, fill: "oklch(var(--chart-3))" },
  { name: "edge", successOrders: 173, fill: "oklch(var(--chart-4))" },
  { name: "other", successOrders: 90, fill: "oklch(var(--chart-5))" },
];

export function DishBarChart({
  chartData,
}: {
  chartData: Pick<
    DashboardIndicatorResType["data"]["dishIndicator"][0],
    "name" | "successOrders"
  >[];
}) {
  const chartDataColors = chartData.map((data, index) => {
    return {
      ...data,
      fill: colors[index] ?? colors[colors.length - 1],
    };
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng món ăn</CardTitle>
        <CardDescription>Được gọi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartDataColors}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={2}
              axisLine={false}
              tickFormatter={(value) => {
                return (
                  chartConfig[value as keyof typeof chartConfig]?.label || value
                );
              }}
            />
            <XAxis dataKey="successOrders" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="successOrders" layout="vertical" radius={5} />
            {/* {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))} */}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
    </Card>
  );
}
