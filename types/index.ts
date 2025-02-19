export enum TransactionEnum {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum CategoryEnum {
  FOOD = "food",
  TRANSPORTATION = "transportation",
  UTILITIES = "utilities",
  ENTERTAINMENT = "entertainment",
  SALARY = "salary",
  OTHER = "other",
}

export type MonthlyChartDataType = {
  name: string;
  income: number;
  expenses: number;
};

export type TransactionType = {
  id: string;
  amount: number;
  category: CategoryEnum;
  date: Date;
  description: string;
  type: TransactionEnum;
};
