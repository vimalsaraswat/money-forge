export enum TransactionEnum {
  INCOME = "income",
  EXPENSE = "expense",
}

export enum PeriodEnum {
  MONTHLY = "monthly",
  YEARLY = "yearly",
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
  category: string;
  categoryId: string;
  type: TransactionEnum;
  date: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CategoryType = {
  id: string;
  name: string;
  description: string | null;
  type: TransactionEnum;
  isPublic: boolean;
};

export type BudgetType = {
  id: string;
  userId: string;
  categoryId: string;
  period: PeriodEnum;
  amount: number;
  startDate: Date;
  createdAt: Date | null;
  updatedAt: Date | null;
  deletedAt: Date | null;
};
