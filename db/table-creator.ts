import { config } from "dotenv";
import { pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

config({ path: ".env.local" });

const TABLE_PREFIX = process.env.TABLE_PREFIX;

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) =>
  TABLE_PREFIX ? `${TABLE_PREFIX}_${name}` : name,
);

export const createEnum = (name: string, enumValues: [string, ...string[]]) => {
  return pgEnum(TABLE_PREFIX ? `${TABLE_PREFIX}_${name}` : name, enumValues);
};
