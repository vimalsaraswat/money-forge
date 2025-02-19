import { MonthlyChartDataType, TransactionType } from "@/types";

export const getTransactionChartData = (transactions: TransactionType[]) => {
  if (!transactions) return [];

  const monthlyData = transactions.reduce(
    (
      acc: {
        [key: string]: MonthlyChartDataType;
      },
      transaction,
    ) => {
      const month = new Date(transaction.date).toLocaleString("default", {
        month: "short",
      });
      const type = transaction.type;
      const amount = transaction.amount;

      if (!acc[month]) {
        acc[month] = { name: month, income: 0, expenses: 0 };
      }

      if (type === "income") {
        acc[month].income += amount;
      } else {
        acc[month].expenses += amount;
      }

      return acc;
    },
    {},
  );

  const monthlyDataArray = Object.values(monthlyData);
  return monthlyDataArray;
};

export const getExpenseChartData = (transactions: TransactionType[]) => {
  if (!transactions) return [];

  const expenseBreakdownData = transactions?.reduce(
    (acc: { [key: string]: number }, transaction) => {
      if (transaction.type === "expense") {
        if (acc[transaction.category]) {
          acc[transaction.category] += transaction.amount;
        } else {
          acc[transaction.category] = transaction.amount;
        }
      }
      return acc;
    },
    {},
  );

  const expenseDataArray = Object.entries(expenseBreakdownData || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  return expenseDataArray;
};
