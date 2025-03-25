"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { TransactionType } from "@/types";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  1: { color: "hsl(var(--chart-1))" },
  2: { color: "hsl(var(--chart-2))" },
  3: { color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export default function CategoryAreaChart({
  data,
  className,
}: {
  data: TransactionType[];
  className?: string;
}) {
  const [compareBetween, setCompareBetween] = useState<string[]>(["", ""]);
  const availableKeys = useMemo(() => {
    return Array.from(new Set(data?.map((item) => item.category)));
  }, [data]);

  const comparisonData = useMemo(() => {
    return (
      data
        ?.filter((item) =>
          compareBetween.filter(Boolean).includes(item.category),
        )
        .reduce(
          (acc, item) => {
            const { date, category, amount } = item;
            const formattedDate = formatDate(date);
            acc[formattedDate] = acc[formattedDate] || {
              date: formattedDate,
              [compareBetween[0]]: 0,
              [compareBetween[1]]: 0,
            };
            acc[formattedDate][category] =
              (acc[formattedDate][category] || 0) + amount;
            return acc;
          },
          {} as unknown as Record<string, { [category: string]: number }>,
        ) || {}
    );
  }, [data, compareBetween]);

  const comparisonDataArray = useMemo(() => {
    return Object.values(comparisonData);
  }, [comparisonData]);

  const chartComparisonData = useMemo(() => {
    return (
      comparisonDataArray?.map((item) => ({
        date: item.date,
        ...Object.fromEntries(
          compareBetween.map((category) => [category, item[category] || 0]),
        ),
      })) || []
    );
  }, [comparisonDataArray, compareBetween]);

  useEffect(() => {
    if (data && data.length > 0) {
      const keys = availableKeys;
      if (keys.length >= 2) {
        setCompareBetween([keys[0] as string, keys[1] as string]);
      } else if (keys.length === 1) {
        setCompareBetween([keys[0] as string, ""]);
      } else {
        setCompareBetween(["", ""]);
      }
    } else {
      setCompareBetween(["", ""]);
    }
  }, [data, availableKeys]);

  const handleCategoryChange = (index: number, value: string) => {
    const newCompareBetween = [...compareBetween];
    newCompareBetween[index] = value;
    setCompareBetween(newCompareBetween);
  };

  const filteredChartComparisonData = useMemo(() => {
    return chartComparisonData.filter((item) => {
      return compareBetween.some((category) => !!item[category]);
    });
  }, [chartComparisonData, compareBetween]);

  return (
    <Card className={className}>
      <CardHeader className="flex items-center justify-between md:flex-row pb-2">
        <div className="space-y-2">
          <CardTitle>Category Transaction Comparison</CardTitle>
          <CardDescription>
            Compare transaction amounts between categories.
          </CardDescription>
        </div>
        <div className="flex flex-col lg:flex-row gap-2 md:items-center space-x-2">
          <Select
            value={compareBetween[0]}
            onValueChange={(value) => handleCategoryChange(0, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Select Category 1"
                className="text-[hsl(var(--chart-1))]"
              />
            </SelectTrigger>
            <SelectContent>
              {availableKeys.map((key) => {
                if (key === compareBetween[1]) return null;
                return (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
          <Select
            value={compareBetween[1]}
            onValueChange={(value) => handleCategoryChange(1, value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category 2" />
            </SelectTrigger>
            <SelectContent>
              {availableKeys.map((key) => {
                if (key === compareBetween[0]) return null;
                return (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {filteredChartComparisonData.length > 0 &&
        compareBetween.filter(Boolean).length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer
              config={chartConfig}
              className="h-[28vh] max-h-80 w-full"
            >
              <AreaChart
                data={filteredChartComparisonData}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <ChartTooltip
                  content={<ChartTooltipContent />}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <Area
                  key={compareBetween[0]}
                  type="monotone"
                  dataKey={compareBetween[0]}
                  stackId="1"
                  stroke={`var(--color-primary-3)`}
                  fill={`var(--color-2)`}
                  fillOpacity={0.6}
                />

                <Area
                  key={compareBetween[1]}
                  type="monotone"
                  dataKey={compareBetween[1]}
                  stackId="1"
                  stroke={`var(--color-primary-2)`}
                  fill={`var(--color-1)`}
                  fillOpacity={0.6}
                />
                {/* {compareBetween.filter(Boolean).map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stackId="1"
                  stroke={`var(--color-primary-${index + 2})`}
                  fill={`var(--color-${index + 1})`}
                  fillOpacity={0.6}
                />
              ))} */}
                {/* <Legend /> */}
              </AreaChart>
            </ChartContainer>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-4">
            {compareBetween.filter(Boolean).length === 0
              ? "Select categories to compare."
              : "No data for selected categories."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
