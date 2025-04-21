import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

const TABLE_PREFIX = process.env.TABLE_PREFIX;

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  ...(TABLE_PREFIX ? { tablesFilter: [`${process.env.TABLE_PREFIX}*`] } : {}),
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
