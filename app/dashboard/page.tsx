import { auth } from "@/auth";
import AddTransactionForm from "@/components/add-transaction-form";
import BudgetOverview from "@/components/budget-overview";
import { ExpenseBreakdown, IncomeExpenseGraph } from "@/components/chart";
import TransactionList from "@/components/transaction-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DB } from "@/db/queries";
import { getExpenseChartData, getTransactionChartData } from "@/lib/helpers";
import { notFound } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const transactions = await DB.getTransactions(session?.user?.id);

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
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2 md:mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Income" amount={totalIncome} />
        <StatCard title="Total Expenses" amount={totalExpenses} />
        <StatCard title="Remaining Balance" amount={remainingBalance} />
      </div>

      <Tabs defaultValue="overview" className="mb-6 space-y-3 md:space-x-3">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <AddTransactionForm />
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <IncomeExpenseGraph data={transactionChartData} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseBreakdown data={expenseChartData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList transactions={transactions} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetOverview />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const StatCard = ({ title, amount }: { title: string; amount: number }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-semibold">
        {amount < 0 ? "-" : ""}${Math.abs(amount)}
      </p>
    </CardContent>
  </Card>
);
