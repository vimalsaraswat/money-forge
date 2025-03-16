"use client";

import { capitalize, generateRandomColor } from "@/lib/utils";
import { MonthlyChartDataType } from "@/types";
import { AlertCircle, Plus } from "lucide-react";
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
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function IncomeExpenseGraph({ data }: { data: MonthlyChartDataType[] }) {
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

const EmptyStateCard = ({
  heading,
  description,
  href,
  addText,
}: {
  heading: string;
  description: string;
  href: string;
  addText: string;
}) => (
  <motion.div
    className="text-center flex flex-col gap-2 items-center justify-center h-full py-20 rounded-lg max-w-[80%] mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <AlertCircle className="h-10 w-10 text-secondary-foreground" />
    <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
    <p className="text-sm text-secondary-foreground">{description}</p>
    <Button variant="outline" size="sm" asChild className="cursor-pointer">
      <Link href={href}>
        <Plus size={28} className="mr-2 h-4 w-4" /> {addText}
      </Link>
    </Button>
  </motion.div>
);
