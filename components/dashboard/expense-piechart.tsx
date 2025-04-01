"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalize, formatCurrency, generateRandomColor } from "@/lib/utils";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import EmptyStateCard from "../EmptyDataCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type ExpenseChartProps = {
  data: {
    name: string;
    value: number;
  }[];
  className?: string;
};

const chartConfig = {
  1: {
    color: "hsl(var(--chart-1))",
  },
  2: {
    color: "hsl(var(--chart-3))",
  },
  3: {
    color: "hsl(var(--chart-2))",
  },
  4: {
    color: "hsl(var(--chart-4))",
  },
  5: {
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function ExpensePieChart({
  data,
  className,
}: ExpenseChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Breakdown of your top expenses</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 grid place-items-center">
        <ExpenseChart data={data} />
      </CardContent>
    </Card>
  );
}

function ExpenseChart({ data }: ExpenseChartProps) {
  if (data?.length === 0)
    return (
      <EmptyStateCard
        heading="No Expenses Yet"
        description="Add an expense to see the breakdown."
        href="/dashboard/transactions/new"
        addText="Add Transaction"
      />
    );

  return (
    <ResponsiveContainer
      width="100%"
      height="100%"
      className="grid place-items-center"
    >
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            dataKey="value"
            // cornerRadius={10}
            label={({ value }) => formatCurrency(value)}
          >
            {data?.map((_, index) => (
              <Cell key={`cell-${index}`} fill={generateRandomColor()} />
            ))}
          </Pie>
          <ChartTooltip
            content={<ChartTooltipContent />}
            formatter={(value, name) => [
              formatCurrency(+value) + "  ",
              capitalize(name as string),
            ]}
          />
          <Legend formatter={(value) => capitalize(value)} />
        </PieChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
