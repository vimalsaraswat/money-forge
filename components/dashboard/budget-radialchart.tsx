"use client";

import { generateRandomColor } from "@/lib/utils";
import { BudgetListType } from "@/types";
import { useMemo } from "react";
import {
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const style = {
  top: "50%",
  right: 0,
  transform: "translate(0, -50%)",
  lineHeight: "24px",
};

export default function BudgetRadialChart({ data }: { data: BudgetListType }) {
  const chartData = useMemo(() => {
    return data?.map((item) => {
      const color = generateRandomColor();
      const percentage = ((item.spent / item.amount) * 100).toFixed(2);
      return {
        name: item.category!,
        value: percentage,
        fill: color,
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 grid place-items-center">
        <BudgetChart data={chartData} />
      </CardContent>
    </Card>
  );
}

function BudgetChart({
  data,
}: {
  data: { name: string; value: string; fill: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="10%"
        outerRadius="80%"
        barSize={10}
        data={data}
      >
        <RadialBar
          label={{ position: "insideStart", fill: "#fff" }}
          dataKey="value"
          enableBackground="#fff"
          background
        />
        <Legend
          iconSize={10}
          layout="vertical"
          verticalAlign="middle"
          wrapperStyle={style}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
