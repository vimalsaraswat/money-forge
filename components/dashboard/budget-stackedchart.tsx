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
import { BudgetListType } from "@/types";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";
import EmptyStateCard from "../EmptyDataCard";

const chartConfig = {
  expense: {
    label: "Expense",
    color: "hsl(var(--chart-1))",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function BudgetStackedChart({
  data,
  className,
}: {
  data: BudgetListType;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Budget vs Expenditure</CardTitle>
        <CardDescription>
          Overview of budget compared to expenditure.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 grid place-items-center">
        {data.length > 0 ? (
          <BudgetChart data={data} />
        ) : (
          <EmptyStateCard
            addText="Add Budgets"
            heading="Visualize Your Budgets"
            description="Start by adding your budget categories and amounts to see a comparison of your budget vs. expenditure."
            href="/dashboard/budgets"
          />
        )}
      </CardContent>
    </Card>
  );
}

function BudgetChart({ data }: { data: BudgetListType }) {
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <BarChart accessibilityLayer data={data}>
          <XAxis
            dataKey="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <Bar
            dataKey="amount"
            stackId="a"
            fill="var(--color-expense)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="spent"
            stackId="a"
            fill="var(--color-budget)"
            radius={[4, 4, 0, 0]}
          />
          <ChartTooltip
            content={<ChartTooltipContent indicator="line" />}
            cursor={false}
            defaultIndex={1}
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
}
