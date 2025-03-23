"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { capitalize, formatCurrency, generateRandomColor } from "@/lib/utils";
import { useMemo } from "react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";
import EmptyStateCard from "../EmptyDataCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type ExpenseChartProps = {
  data: {
    name: string;
    value: number;
  }[];
};

export default function ExpensePieChart({ data }: ExpenseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
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

  const colors = useMemo(() => {
    return data?.map(() => generateRandomColor());
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={{}} className="min-h-[300px] w-full">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            dataKey="value"
          >
            {data?.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <ChartTooltip
            content={<ChartTooltipContent wrapperClassName="bg-red-500" />}
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
