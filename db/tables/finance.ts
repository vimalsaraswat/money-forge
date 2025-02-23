import {
  text,
  timestamp,
  pgEnum,
  doublePrecision,
  boolean,
} from "drizzle-orm/pg-core";
import { users } from "./auth";
import { TransactionEnum } from "@/types";
import { createTable } from "../table-creator";

export const transactionTypeEnum = pgEnum(
  "transactionType",
  Object.values(TransactionEnum) as [string, ...string[]],
);

export const categories = createTable("categories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  type: transactionTypeEnum("type").notNull(),
  isPublic: boolean("isPublic").default(false).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
});

export const transactions = createTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  amount: doublePrecision("amount").notNull(),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  date: timestamp("date", { mode: "date" }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
});

export const budgets = createTable("budgets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  categoryId: text("categoryId")
    .notNull()
    .references(() => categories.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  amount: doublePrecision("amount").notNull(),
  startDate: timestamp("startDate", { mode: "date" }).notNull(),
  endDate: timestamp("endDate", { mode: "date" }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
});
