import { db } from "@/db/drizzle";
import { budgets, categories, transactions } from "@/db/tables/finance";
import { TransactionType } from "@/types";
import { and, desc, eq, isNull, or, sql } from "drizzle-orm";

export const DBf = {
  // ==================== Transactions ====================
  createTransaction: async (transaction: typeof transactions.$inferInsert) => {
    return await db.insert(transactions).values(transaction);
  },

  updateTransaction: async (
    transactionId: string,
    transaction: Partial<TransactionType>,
  ) => {
    return await db
      .update(transactions)
      .set({ ...transaction, updatedAt: sql`NOW()` })
      .where(eq(transactions.id, transactionId));
  },

  deleteTransaction: async (transactionId: string) => {
    return await db
      .update(transactions)
      .set({ deletedAt: sql`NOW()` })
      .where(eq(transactions.id, transactionId));
  },

  getTransactions: async (userId: string) => {
    return await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        category: categories.name,
        type: categories.type,
        date: transactions.date,
        description: transactions.description,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(eq(transactions.userId, userId), isNull(transactions.deletedAt)),
      )
      .orderBy(desc(transactions.date));
  },

  getTransactionById: async (transactionId: string, userId: string) => {
    return await db
      .select({
        id: transactions.id,
        userId: transactions.userId,
        amount: transactions.amount,
        category: categories.name,
        categoryId: categories.id,
        type: categories.type,
        date: transactions.date,
        description: transactions.description,
        createdAt: transactions.createdAt,
        updatedAt: transactions.updatedAt,
      })
      .from(transactions)
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, userId),
          isNull(transactions.deletedAt),
        ),
      );
  },

  // ==================== Categories ====================
  createCategory: async (category: typeof categories.$inferInsert) => {
    return await db.insert(categories).values(category);
  },

  updateCategory: async (
    categoryId: string,
    category: Partial<typeof categories.$inferInsert>,
  ) => {
    return await db
      .update(categories)
      .set({ ...category, updatedAt: sql`NOW()` })
      .where(eq(categories.id, categoryId));
  },

  deleteCategory: async (categoryId: string) => {
    return await db
      .update(categories)
      .set({ deletedAt: sql`NOW()` })
      .where(eq(categories.id, categoryId));
  },

  getCategories: async (userId: string) => {
    return await db
      .select({
        id: categories.id,
        name: categories.name,
        description: categories.description,
        type: categories.type,
        isPublic: categories.isPublic,
      })
      .from(categories)
      .where(
        and(
          or(eq(categories.userId, userId), eq(categories.isPublic, true)),
          isNull(categories.deletedAt),
        ),
      )
      .orderBy(desc(categories.updatedAt));
  },

  getCategoryById: async (categoryId: string) => {
    return await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, categoryId), isNull(categories.deletedAt)));
  },

  // ==================== Budgets ====================
  createBudget: async (budget: typeof budgets.$inferInsert) => {
    return await db.insert(budgets).values(budget);
  },

  updateBudget: async (
    budgetId: string,
    budget: Partial<typeof budgets.$inferInsert>,
  ) => {
    return await db
      .update(budgets)
      .set({ ...budget, updatedAt: sql`NOW()` })
      .where(eq(budgets.id, budgetId));
  },

  deleteBudget: async (budgetId: string) => {
    return await db
      .update(budgets)
      .set({ deletedAt: sql`NOW()` })
      .where(eq(budgets.id, budgetId));
  },

  getBudgets: async (userId: string) => {
    return await db
      .select({
        id: budgets.id,
        category: categories.name,
        period: budgets.period,
        spent: sql<number>`COALESCE(SUM(${transactions.amount}), 0)`,
        amount: budgets.amount,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .leftJoin(transactions, eq(categories.id, transactions.categoryId))
      .where(and(eq(budgets.userId, userId), isNull(budgets.deletedAt)))
      .groupBy(budgets.id, categories.name, budgets.amount)
      .orderBy(desc(budgets.updatedAt));
  },

  getBudgetById: async (budgetId: string) => {
    return await db
      .select()
      .from(budgets)
      .where(and(eq(budgets.id, budgetId), isNull(budgets.deletedAt)));
  },

  // insertFakeTransactionsData: async () => {
  //   await db.insert(transactions).values([
  //     {
  //       userId: "e6d51f80-6a38-4946-89ee-c1c49f1f2673",
  //       categoryId: "27ca5563-ac12-490b-9782-56367b0155e6",
  //       amount: 100,
  //       date: new Date("2023-01-01"),
  //     },
  //     {
  //       userId: "e6d51f80-6a38-4946-89ee-c1c49f1f2673",
  //       categoryId: "a6e2702e-19bc-4d2e-a7a1-1f6dd4fffd76",
  //       amount: 200,
  //       date: new Date("2023-02-01"),
  //     },
  //     {
  //       userId: "e6d51f80-6a38-4946-89ee-c1c49f1f2673",
  //       categoryId: "27ca5563-ac12-490b-9782-56367b0155e6",
  //       amount: 50,
  //       date: new Date("2023-01-01"),
  //     },
  //     {
  //       userId: "e6d51f80-6a38-4946-89ee-c1c49f1f2673",
  //       categoryId: "a6e2702e-19bc-4d2e-a7a1-1f6dd4fffd76",
  //       amount: 100,
  //       date: new Date("2023-02-01"),
  //     },
  //   ]);
  // },

  // insertFakeBudgetsData: async () => {
  //   await db.insert(budgets).values([
  //     {
  //       userId: "e6d51f80-6a38-4946-89ee-c1c49f1f2673",
  //       categoryId: "27ca5563-ac12-490b-9782-56367b0155e6",
  //       amount: 1000,
  //       startDate: new Date("2023-01-01"),
  //       endDate: new Date("2023-12-31"),
  //       period: "monthly",
  //     },
  //     {
  //       userId: "e6d51f80-6a38-4946-89ee-c1c49f1f2673",
  //       categoryId: "a6e2702e-19bc-4d2e-a7a1-1f6dd4fffd76",
  //       amount: 500,
  //       startDate: new Date("2023-01-01"),
  //       endDate: new Date("2023-12-31"),
  //       period: "monthly",
  //     },
  //   ]);
  // },

  insertFakeCategoriesData: async () => {
    const userId = "a67856bd-fdd0-4699-a172-1c783e27cbb4";
    await db.insert(categories).values([
      {
        name: "Housing",
        description:
          "Rent or mortgage payments, property taxes, home insurance, and maintenance costs",
        type: "expense",
        userId,
        isPublic: true,
      },
      {
        name: "Utilities",
        description:
          "Electricity, water, gas, internet, and other utility bills",
        type: "expense",
        userId,
        isPublic: true,
      },
      {
        name: "Transportation",
        description:
          "Fuel, public transit fares, car maintenance, and vehicle insurance",
        type: "expense",
        userId,
        isPublic: true,
      },
      {
        name: "Groceries",
        description: "Food and household supplies purchased for daily use",
        type: "expense",
        userId,
        isPublic: true,
      },
      {
        name: "Healthcare",
        description:
          "Medical bills, prescriptions, health insurance premiums, and wellness expenses",
        type: "expense",
        userId,
        isPublic: true,
      },
      {
        name: "Education",
        description:
          "Tuition fees, school supplies, books, and other educational expenses",
        type: "expense",
        userId,
        isPublic: true,
      },
      {
        name: "Debt Payments",
        description:
          "Credit card payments, loan repayments, and other debt obligations",
        type: "expense",
        userId,
        isPublic: true,
      },
      // {
      //   name: "Entertainment and Leisure",
      //   description:
      //     "Subscriptions, movies, hobbies, sports, vacation expenses",
      //   type: "expense",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Salary/Wages",
      //   description:
      //     "Regular income from employment, including base salary and any bonuses or commissions",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Freelance/Side Income",
      //   description:
      //     "Earnings from freelance work, side gigs, or part-time jobs",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Investment Income",
      //   description: "Dividends, interest, or capital gains from investments",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Rental Income",
      //   description:
      //     "Income earned from renting out properties or other assets",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Business Income",
      //   description:
      //     "Earnings from running a business, including profits from goods or services sold",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Pension/Retirement Income",
      //   description:
      //     "Regular payments from pension plans or retirement accounts",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
      // {
      //   name: "Other Income",
      //   description:
      //     "Gifts, inheritances, child support, alimony, or any other irregular income",
      //   type: "income",
      //   userId,
      //   isPublic: true,
      // },
    ]);
  },
};
