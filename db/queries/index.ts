import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { transactions } from "../tables/finance";

export const DB = {
  createTransaction: async (transaction: typeof transactions.$inferInsert) => {
    return await db.insert(transactions).values(transaction);
  },
  getTransactions: async (userId: string) => {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId));
  },
};
