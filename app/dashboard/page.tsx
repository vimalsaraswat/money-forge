import { auth } from "@/auth";
import { ExpenseBreakdown, IncomeExpenseGraph } from "@/components/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DB } from "@/db/queries";
import { getExpenseChartData, getTransactionChartData } from "@/lib/helpers";
import { cn, formatCurrency } from "@/lib/utils";
import { TransactionType } from "@/types";
import { notFound } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const transactions = (await DB.getTransactions(
    session?.user?.id,
  )) as TransactionType[];

  const transactionChartData = getTransactionChartData(transactions);
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
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <StatCard title="Total Income" amount={totalIncome} />
        <StatCard title="Total Expenses" amount={totalExpenses} />
        <StatCard title="Remaining Balance" amount={remainingBalance} />
      </div>
      <div className="min-h-min flex-1 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 grid place-items-center">
            {transactionChartData?.length > 0 ? (
              <IncomeExpenseGraph data={transactionChartData} />
            ) : (
              <div className="grid place-items-center py-40">
                <p className="text-muted-foreground">
                  No Income vs Expenses data available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 grid place-items-center">
            {expenseChartData?.length > 0 ? (
              <ExpenseBreakdown data={expenseChartData} />
            ) : (
              <div className="grid place-items-center py-40">
                <p className="text-muted-foreground">
                  No Expense Breakdown data available.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const StatCard = ({ title, amount }: { title: string; amount: number }) => (
  <Card className="rounded-xl">
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
