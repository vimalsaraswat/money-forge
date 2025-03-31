import { auth } from "@/auth";
import {
  BudgetStackedChart,
  // BudgetRadialChart,
  CategoryAreaChart,
  ExpensePieChart,
  TransactionBarChart,
} from "@/components/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { getExpenseChartData } from "@/lib/helpers";
import { cn, formatCurrency } from "@/lib/utils";
import { BudgetListType, TransactionType } from "@/types";
import { PlusIcon, WalletMinimalIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache as cache } from "next/cache";

const getCachedDashboardData = cache(
  async (userId: string) => {
    const transactionsPromise = DB.getTransactions(userId);
    const budgetsPromise = DB.getBudgets(userId);
    return await Promise.all([
      transactionsPromise as Promise<TransactionType[]>,
      budgetsPromise as Promise<BudgetListType>,
    ]);
  },
  [],
  {
    tags: ["dashboard-data"],
    revalidate: 60,
  },
);

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    notFound();
  }

  const [transactions, budgets] = await getCachedDashboardData(userId);

  const expenseChartData = getExpenseChartData(transactions);

  const totalIncome = transactions?.reduce((acc, transaction) => {
    if (transaction.type === "income") {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);
  const totalExpenses = transactions?.reduce((acc, transaction) => {
    if (transaction.type === "expense") {
      return acc + transaction.amount;
    }
    return acc;
  }, 0);

  const remainingBalance = totalIncome - totalExpenses;

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/transactions">
              <PlusIcon className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only"> Transaction</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/budgets">
              <WalletMinimalIcon className="mr-1 h-4 w-4" />
              {budgets?.length || 0}
              <span className="sr-only sm:not-sr-only">Budgets</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="grid auto-rows-min gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3">
        <StatCard title="Total Income" amount={totalIncome} />
        <StatCard title="Total Expenses" amount={totalExpenses} />
        <StatCard
          title="Remaining Balance"
          amount={remainingBalance}
          className="col-span-full sm:col-span-1"
        />
      </div>
      <div className="min-h-min flex-1 rounded-xl grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* <TransactionBarChart data={transactions} className="col-span-full" /> */}
        <BudgetStackedChart data={budgets} />
        <ExpensePieChart data={expenseChartData} />
        {/* <CategoryAreaChart data={transactions} className="col-span-full" /> */}
        {/* <BudgetRadialChart data={budgets} />
        <Card>
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            {budgets?.length > 0 ? (
              <ul className="list-none p-0">
                {budgets.map((budget) => (
                  <li key={budget?.id} className="mb-2">
                    <div className="font-semibold">{budget?.category}</div>
                    <div className="text-sm text-muted-foreground">
                      Spent: {formatCurrency(budget?.spent)} of{" "}
                      {formatCurrency(budget?.amount)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No budgets created yet.
              </p>
            )}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

const StatCard = ({
  title,
  amount,
  className,
}: {
  title: string;
  amount: number;
  className?: string;
}) => (
  <Card
    className={cn(
      "rounded-xl lg:gap-0 lg:flex-row lg:items-end lg:justify-evenly",
      className,
    )}
  >
    <CardHeader>
      <CardTitle className="text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p
        className={cn(
          "text-2xl font-semibold text-nowrap",
          amount < 0 && "text-destructive",
        )}
      >
        {amount < 0 && "-"}
        {formatCurrency(Math.abs(amount))}
      </p>
    </CardContent>
  </Card>
);
