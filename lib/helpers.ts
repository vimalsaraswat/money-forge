import { BarChartDataType, TransactionType } from "@/types";
import { formatDate } from "./utils";

const aggregateTransactionsByTimeUnit = (
  transactions: TransactionType[],
  getTimeUnit: (date: Date) => string,
) => {
  const data = transactions.reduce(
    (
      acc: {
        [key: string]: BarChartDataType & { startTime: Date; endTime: Date };
      },
      transaction,
    ) => {
      const timeUnit = getTimeUnit(new Date(transaction.date));
      const type = transaction.type;
      const amount = transaction.amount;

      if (!acc[timeUnit]) {
        acc[timeUnit] = {
          name: timeUnit,
          income: 0,
          expenses: 0,
          startTime: new Date(transaction.date),
          endTime: new Date(transaction.date),
        };
      }

      if (type === "income") {
        acc[timeUnit].income += amount;
      } else {
        acc[timeUnit].expenses += amount;
      }

      if (
        acc[timeUnit].startTime.getTime() > new Date(transaction.date).getTime()
      ) {
        acc[timeUnit].startTime = new Date(transaction.date);
      }

      if (
        acc[timeUnit].endTime.getTime() < new Date(transaction.date).getTime()
      ) {
        acc[timeUnit].endTime = new Date(transaction.date);
      }

      return acc;
    },
    {},
  );

  const sortedDataArray = Object.entries(data).sort((a, b) => {
    return a[1].startTime.getTime() - b[1].startTime.getTime();
  });

  const lastThirtyDataArray = sortedDataArray?.slice(-20);
  const sortedData: { [key: string]: BarChartDataType } =
    Object.fromEntries(lastThirtyDataArray);

  return sortedData;
};

export const getTransactionChartData = (transactions: TransactionType[]) => {
  if (!transactions)
    return { monthlyDataArray: [], weeklyDataArray: [], dailyDataArray: [] };

  const dailyData = aggregateTransactionsByTimeUnit(transactions, (date) =>
    formatDate(date, { year: undefined }),
  );
  const dailyDataArray = Object.entries(dailyData).map(([, value]) => value);

  const weeklyData = aggregateTransactionsByTimeUnit(transactions, (date) => {
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
    return formatDate(startOfWeek, { year: "2-digit" });
  });
  const weeklyDataArray = Object.entries(weeklyData).map(([, value]) => value);

  const monthlyData = aggregateTransactionsByTimeUnit(transactions, (date) =>
    date.toLocaleString("default", {
      month: "short",
    }),
  );
  const monthlyDataArray = Object.entries(monthlyData).map(
    ([, value]) => value,
  );

  return { monthlyDataArray, weeklyDataArray, dailyDataArray };
};

export const getExpenseChartData = (transactions: TransactionType[]) => {
  if (!transactions) return [];

  const expenseBreakdownData = transactions.reduce(
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

  const sortedExpenseBreakdownData = Object.entries(
    expenseBreakdownData || {},
  ).sort(([, aValue], [, bValue]) => bValue - aValue);

  const topFourExpenseBreakdownData = sortedExpenseBreakdownData.slice(0, 5);

  const expenseDataArray = topFourExpenseBreakdownData.map(([name, value]) => ({
    name,
    value,
  }));

  return expenseDataArray;
};
