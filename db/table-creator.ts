import { config } from "dotenv";
import { pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

config({ path: ".env.local" });

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator(
  (name) => `${process.env.TABLE_PREFIX}_${name}`,
);

export const createEnum = (name: string, enumValues: [string, ...string[]]) => {
  return pgEnum(`${process.env.TABLE_PREFIX}_${name}`, enumValues);
};
