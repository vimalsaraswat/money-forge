import { db } from "@/db/drizzle";
import { TransactionType } from "@/types";
import { and, count, desc, eq, gte, isNull, lte, or, sql } from "drizzle-orm";
import { budgets, categories, transactions } from "../tables/finance";

export const financeQueries = {
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

  getTransactions: async (
    userId: string,
    limit: number = 400,
    order: "date" | "updatedAt" = "date",
  ) => {
    return await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        category: categories.name,
        image: categories.image,
        categoryId: transactions.categoryId,
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
      .orderBy(desc(transactions[order]))
      .limit(limit);
  },

  getTransactionsInRange: async (
    userId: string,
    startDate: Date,
    endDate: Date,
  ) => {
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
        and(
          eq(transactions.userId, userId),
          isNull(transactions.deletedAt),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
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
        categoryId: budgets.categoryId,
        image: categories.image,
        period: budgets.period,
        spent: sql<number>`COALESCE(SUM(CASE WHEN ${transactions.deletedAt} IS NULL AND ${transactions.date} >= ${budgets.startDate} AND ${transactions.date} <= ${budgets.endDate} THEN ${transactions.amount} ELSE 0 END), 0)`,
        amount: budgets.amount,
        startDate: budgets.startDate,
        endDate: budgets.endDate,
      })
      .from(budgets)
      .leftJoin(categories, eq(budgets.categoryId, categories.id))
      .leftJoin(
        transactions,
        and(
          eq(budgets.categoryId, transactions.categoryId),
          eq(budgets.userId, transactions.userId),
        ),
      )
      .where(and(eq(budgets.userId, userId), isNull(budgets.deletedAt)))
      .groupBy(
        budgets.id,
        categories.name,
        budgets.amount,
        categories.image,
        categories.id,
      )
      .orderBy(desc(budgets.updatedAt));
  },

  getBudgetById: async (budgetId: string, userId: string) => {
    return await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.id, budgetId),
          isNull(budgets.deletedAt),
          eq(budgets.userId, userId),
        ),
      );
  },

  getTransactionCount: async (categoryId: string) => {
    return await db
      .select({ count: count() })
      .from(transactions)
      .where(eq(transactions.categoryId, categoryId));
  },
  getBudgetCount: async (categoryId: string) => {
    return await db
      .select({ count: count() })
      .from(budgets)
      .where(eq(budgets.categoryId, categoryId));
  },
};
