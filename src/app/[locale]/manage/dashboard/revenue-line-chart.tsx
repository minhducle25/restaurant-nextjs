'use client'

import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format, parse } from 'date-fns'
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/schemaValidations/indicator.schema'
import { useTranslations } from 'next-intl'
const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig

export function RevenueLineChart({revenueByDate}:{revenueByDate: DashboardIndicatorResType["data"]["revenueByDate"]}) {
  const t = useTranslations('Dashboard')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('revenue')}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={revenueByDate}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (revenueByDate.length < 8) {
                  return value
                }
                if (revenueByDate.length < 33) {
                  const date = parse(value, 'dd/MM/yyyy', new Date())
                  return format(date, 'dd')
                }
                return ''
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dashed' />} />
            <Line dataKey='revenue' name={t('revenue')} type='linear' stroke='var(--color-desktop)' strokeWidth={2} dot={false}  />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
      </CardFooter>
    </Card>
  )
}
