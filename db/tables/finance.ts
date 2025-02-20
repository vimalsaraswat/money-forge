import { text, timestamp, pgEnum, doublePrecision } from "drizzle-orm/pg-core";
import { users } from "./auth";
import { createTable } from "../table-creator";
import { CategoryEnum, TransactionEnum } from "@/types";

export const transactionTypeEnum = pgEnum(
  "transactionType",
  Object.values(TransactionEnum) as [string, ...string[]],
);
export const categoryEnum = pgEnum(
  "category",
  Object.values(CategoryEnum) as [string, ...string[]],
);

export const transactions = createTable("transaction", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  amount: doublePrecision("amount").notNull(),
  category: categoryEnum("category").notNull(),
  type: transactionTypeEnum("type").notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
});
