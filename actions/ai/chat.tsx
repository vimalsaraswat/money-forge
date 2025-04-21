"use server";

import { createStreamableValue, getMutableAIState } from "ai/rsc";
import { google } from "@ai-sdk/google";
import { ReactNode } from "react";
import { generateId, smoothStream, streamText, tool } from "ai";
import { auth } from "@/auth";
import { prompt } from "@/config/prompts";
import { after } from "next/server";
import { DB } from "@/db/queries";
import { z } from "zod";

export interface ServerMessage {
  role: "user" | "assistant" | "function";
  content: string;
  chatId?: string;
  createdAt?: Date;
}

export interface ClientMessage {
  id: string;
  role: "user" | "assistant" | "function";
  display: ReactNode;
  chatId?: string;
}

const getTransactions = tool({
  description: "Get the past transactions of the user",
  parameters: z.object({}),
  execute: async () => {
    try {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Not authenticated");
      }
      const transactions = await DB.getTransactions(
        session.user.id,
        100,
        "date",
      );

      console.log("Transactions fetched");
      return transactions;
    } catch (err) {
      const error = err as Error;
      console.error("Error fetching transactions:", error);
      return { error: error.message };
    }
  },
});

export async function continueConversation(input: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }
    if (!session?.user?.credits || session?.user?.credits <= 0) {
      throw new Error("Not enough credits (ask vimal for more)");
    }

    const history = getMutableAIState();
    const userMessage: ServerMessage = {
      role: "user",
      content: input,
      createdAt: new Date(),
    };
    history.update([...history.get(), userMessage]);

    const stream = createStreamableValue();

    (async () => {
      const { textStream } = streamText({
        model: google("gemini-1.5-flash"),
        system: prompt,
        messages: [...history.get(), userMessage],
        maxSteps: 5,
        // experimental_activeTools: [""],
        experimental_transform: smoothStream({ chunking: "word" }),
        experimental_generateMessageId: generateId,
        tools: { getTransactions },
        onFinish: async ({ response }) => {
          console.log("response", JSON.stringify(response.messages, null, 2));

          let assistantMessage = "";
          response.messages?.forEach((message) => {
            if (assistantMessage.trim().length !== 0) return;
            if (message.role === "assistant") {
              assistantMessage = (message.content[0] as { text: string }).text;
            }
          });

          history.done([
            ...history.get(),
            {
              role: "assistant",
              content: assistantMessage,
              createdAt: new Date(),
            },
          ]);
        },
      });

      for await (const text of textStream) {
        stream.update(text);
      }

      stream.done();
    })();

    after(async () => {
      try {
        const userId = session?.user?.id;
        if (!session.user?.id) return;
        if (!(userId && session?.user?.credits > 0)) return;

        await DB.updateUser(userId, {
          credits: session?.user?.credits - 1,
        });

        let chatId = history.get()?.[0]?.chatId;
        if (!chatId) {
          chatId = (await DB.createChat(userId))[0].id;
        }

        history.get()?.forEach(async (message: ServerMessage) => {
          if (!message?.chatId) {
            console.log("message", message);
            await DB.createMessage({
              chatId,
              parts: [{ type: "text", text: message.content }],
              role: message.role,
              attachments: [],
              createdAt: message.createdAt || new Date(),
            });
          }
        });
      } catch {
        console.error("Failed to save chat");
      }
    });

    return {
      message: {
        role: "assistant",
        display: stream.value,
      },
      success: true,
    };
  } catch (err) {
    const error = err as Error;
    console.error(error);
    return { success: false, message: error?.message || "An error occurred" };
  }
}

export async function getChats() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }

    const chatIds = await DB.getChats(session?.user?.id);
    const latestChatId = chatIds[0]?.id;

    if (!latestChatId) {
      return [];
    }

    const messages = await DB.getMessages(latestChatId);

    const formattedMessages = messages.map((message) => ({
      chatId: message.chatId,
      role: message.role,
      content: message?.parts[0]?.text,
    }));

    return formattedMessages as ServerMessage[];
  } catch {
    return [];
  }
}
