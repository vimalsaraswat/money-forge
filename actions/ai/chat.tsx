"use server";

import { auth } from "@/auth";
import { TextStreamMessage } from "@/components/message";
import { prompt } from "@/config/prompts";
import { DB } from "@/db/queries";
import { google } from "@ai-sdk/google";
import { streamUI } from "ai/rsc";
import { after } from "next/server";
import { z } from "zod";
import { getUserCategories } from "../category";

export async function submitUserMessage(input: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Not authenticated");
    }
    if (!session?.user?.credits || session?.user?.credits <= 0) {
      throw new Error("Not enough credits (ask vimal for more)");
    }

    const ui = await streamUI({
      model: google("gemini-1.5-flash"),
      system: prompt,
      prompt: input,
      text: ({ content }) => <TextStreamMessage content={content} />,
      tools: {
        getFinanceCategories: {
          description: "Get all finance categories available to user",
          parameters: z.object({}),
          generate: async () => {
            const categories = await getUserCategories();

            return (
              <TextStreamMessage
                content={categories
                  ?.map(
                    (category) =>
                      `**${category.name}**\n${
                        category.description || "No description available."
                      }`,
                  )
                  .join("\n\n")}
              />
            );
          },
        },
      },
    });

    after(async () => {
      if (session?.user?.id && session?.user?.credits > 0)
        await DB.updateUser(session?.user?.id, {
          credits: session?.user?.credits - 1,
        });
    });

    return {
      message: ui.value,
      success: true,
    };
  } catch (err) {
    const error = err as Error;
    // console.log(JSON.stringify(error, null, 2));
    return { success: false, message: error?.message || "An error occurred" };
  }
}
