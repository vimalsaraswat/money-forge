import { text, timestamp, pgEnum, doublePrecision } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { createTable } from "../table-creator";

export const transactionTypeEnum = pgEnum("transactionType", [
  "income",
  "expense",
]);
export const categoryEnum = pgEnum("category", [
  "food",
  "transportation",
  "utilities",
  "entertainment",
  "salary",
  "other",
]);

export const transactions = createTable("transaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: doublePrecision("amount").notNull(),
  category: categoryEnum("category").notNull(),
  transactionType: transactionTypeEnum("transactionType").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});
