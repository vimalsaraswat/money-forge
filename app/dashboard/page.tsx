import { auth } from "@/auth";
import {
  TransactionBarChart,
  ExpensePieChart,
  // BudgetRadialChart,
} from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { getExpenseChartData } from "@/lib/helpers";
import { cn, formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/types";
import { notFound } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    notFound();
  }

  const transactionsPromise = DB.getTransactions(userId);
  const budgetsPromise = DB.getBudgets(userId);

  const [transactions] = await Promise.all([
    transactionsPromise as Promise<TransactionType[]>,
    // budgetsPromise as Promise<BudgetListType>,
  ]);

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
    <div className="flex flex-col gap-4 h-full overflow-auto">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid auto-rows-min gap-2 sm:gap-4 grid-cols-2 sm:grid-cols-3">
        <StatCard title="Total Income" amount={totalIncome} />
        <StatCard title="Total Expenses" amount={totalExpenses} />
        <StatCard
          title="Remaining Balance"
          amount={remainingBalance}
          className="col-span-full sm:col-span-1"
        />
      </div>
      <div className="min-h-min flex-1 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-full lg:col-span-1">
          <TransactionBarChart data={transactions} />
        </div>
        <ExpensePieChart data={expenseChartData} />
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
  <Card className={cn("rounded-xl", className)}>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p
        className={cn(
          "text-2xl font-semibold",
          amount < 0 && "text-destructive",
        )}
      >
        {amount < 0 && "-"}
        {formatCurrency(Math.abs(amount))}
      </p>
    </CardContent>
  </Card>
);
