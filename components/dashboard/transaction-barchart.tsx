"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
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
import { getTransactionChartData } from "@/lib/helpers";
import { capitalize, formatCurrency } from "@/lib/utils";
import { BarChartDataType, TransactionType } from "@/types";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import EmptyStateCard from "../EmptyDataCard";

const chartConfig = {
  income: {
    label: "Income",
    color: "#2563eb",
  },
  expense: {
    label: "Expense",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function TransactionBarChart({
  data,
  className,
}: {
  data: TransactionType[];
  className?: string;
}) {
  const { monthlyDataArray, weeklyDataArray, dailyDataArray } = useMemo(() => {
    return getTransactionChartData(data);
  }, [data]);

  const [timeRange, setTimeRange] = useState<"monthly" | "weekly" | "daily">(
    "weekly",
  );

  const chartData = (() => {
    switch (timeRange) {
      case "monthly":
        return monthlyDataArray;
      case "weekly":
        return weeklyDataArray;
      case "daily":
        return dailyDataArray;
      default:
        return monthlyDataArray;
    }
  })();

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Income and Expenses</CardTitle>
        <Select
          value={timeRange}
          onValueChange={(value) =>
            setTimeRange(value as "monthly" | "weekly" | "daily")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 grid place-items-center">
        <IncomeExpenseGraph data={chartData} />
      </CardContent>
    </Card>
  );
}

export function IncomeExpenseGraph({ data }: { data: BarChartDataType[] }) {
  if (data?.length === 0)
    return (
      <EmptyStateCard
        heading="No Income or Expenses Yet"
        description="Add an income or expense to see the breakdown."
        href="/dashboard/transactions/new"
        addText="Add Transaction"
      />
    );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={chartConfig} className="h-[28vh] max-h-80 w-full">
        <BarChart
          accessibilityLayer
          data={data}
          margin={{
            left: 0,
            right: 0,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => capitalize(value)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value, name) => [
              formatCurrency(+value) + "  ",
              capitalize(name as string),
            ]}
          />
          <ChartLegend formatter={(value) => capitalize(value)} />
          <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          <Bar dataKey="expenses" fill="var(--color-expense)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
