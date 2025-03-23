import { BarChartDataType, TransactionType } from "@/types";
import { formatDate } from "./utils";

const aggregateTransactionsByTimeUnit = (
  transactions: TransactionType[],
  getTimeUnit: (date: Date) => string,
) => {
  return transactions.reduce(
    (
      acc: {
        [key: string]: BarChartDataType;
      },
      transaction,
    ) => {
      const timeUnit = getTimeUnit(new Date(transaction.date));
      const type = transaction.type;
      const amount = transaction.amount;

      if (!acc[timeUnit]) {
        acc[timeUnit] = { name: timeUnit, income: 0, expenses: 0 };
      }

      if (type === "income") {
        acc[timeUnit].income += amount;
      } else {
        acc[timeUnit].expenses += amount;
      }

      return acc;
    },
    {},
  );
};

export const getTransactionChartData = (transactions: TransactionType[]) => {
  if (!transactions)
    return { monthlyDataArray: [], weeklyDataArray: [], dailyDataArray: [] };

  const dailyData = aggregateTransactionsByTimeUnit(transactions, (date) =>
    formatDate(date, { year: undefined }),
  );
  const dailyDataArray = Object.entries(dailyData).map(([_, value]) => value);

  const weeklyData = aggregateTransactionsByTimeUnit(transactions, (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    return formatDate(startOfWeek, { year: "2-digit" });
  });
  const weeklyDataArray = Object.entries(weeklyData).map(([_, value]) => value);

  const monthlyData = aggregateTransactionsByTimeUnit(transactions, (date) =>
    date.toLocaleString("default", {
      month: "short",
    }),
  );
  const monthlyDataArray = Object.entries(monthlyData).map(
    ([_, value]) => value,
  );

  return { monthlyDataArray, weeklyDataArray, dailyDataArray };
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
