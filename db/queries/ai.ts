import { db } from "@/db/drizzle";
import { and, desc, eq, isNull } from "drizzle-orm";
import { chats, messages } from "../tables/finance";

export const aiQueries = {
  getChats: async (userId: string) => {
    return await db
      .select()
      .from(chats)
      .where(and(eq(chats.userId, userId), isNull(chats.deletedAt)))
      .orderBy(desc(chats.createdAt));
  },
  getMessages: async (chatId: string) => {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, chatId))
      .orderBy(messages.createdAt)
      .limit(400);
  },
  createChat: async (userId: string) => {
    return await db
      .insert(chats)
      .values({
        userId,
      })
      .returning();
  },
  createMessage: async (message: typeof messages.$inferInsert) => {
    return await db.insert(messages).values(message).returning();
  },
};
