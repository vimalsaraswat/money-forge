"use client";

import { capitalize, generateRandomColor } from "@/lib/utils";
import { MonthlyChartDataType } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export function IncomeExpenseGraph({ data }: { data: MonthlyChartDataType[] }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tickFormatter={(value) => capitalize(value)} />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [value, capitalize(name as string)]}
        />
        <Legend formatter={(value) => capitalize(value)} />
        <Bar dataKey="income" fill="#8884d8" />
        <Bar dataKey="expenses" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ExpenseBreakdown({
  data,
}: {
  data: {
    name: string;
    value: number;
  }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data?.map((_, index) => (
            <Cell key={`cell-${index}`} fill={generateRandomColor()} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, capitalize(name as string)]}
        />
        <Legend formatter={(value) => capitalize(value)} />
      </PieChart>
    </ResponsiveContainer>
  );
}
