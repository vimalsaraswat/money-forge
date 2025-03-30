import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "../schema";

export const userQueries = {
  getUser: async (userId: string) => {
    return await db.select().from(users).where(eq(users.id, userId));
  },
  getUserByEmail: async (email: string) => {
    return await db.select().from(users).where(eq(users.email, email));
  },

  updateUser: async (
    userId: string,
    user: Partial<typeof users.$inferInsert>,
  ) => {
    return await db.update(users).set(user).where(eq(users.id, userId));
  },

  createUser: async ({
    name,
    email,
    password,
    image,
  }: typeof users.$inferInsert) => {
    const user = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name,
        email,
        password,
        image,
      })
      .returning();
    return user.pop();
  },
};
