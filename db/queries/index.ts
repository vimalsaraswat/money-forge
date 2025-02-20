import { desc, eq, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { transactions } from "../tables/finance";
import { TransactionType } from "@/types";

export const DB = {
  createTransaction: async (transaction: typeof transactions.$inferInsert) => {
    return await db.insert(transactions).values(transaction);
  },
  updateTransaction: async (
    transactionId: string,
    transaction: TransactionType,
  ) => {
    return await db
      .update(transactions)
      .set({ ...transaction, updatedAt: sql`NOW()` })
      .where(eq(transactions.id, transactionId));
  },
  deleteTransaction: async (transactionId: string) => {
    return await db
      .delete(transactions)
      .where(eq(transactions.id, transactionId));
  },
  getTransactions: async (userId: string) => {
    return await db
      .select({
        id: transactions.id,
        amount: transactions.amount,
        category: transactions.category,
        date: transactions.date,
        description: transactions.description,
        type: transactions.type,
      })
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.updatedAt));
  },
  getTransactionById: async (transactionId: string) => {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.id, transactionId));
  },
};
