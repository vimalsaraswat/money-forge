"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function getRoast({
  category,
  budget,
  spending,
  name,
}: {
  category: string;
  budget: string;
  spending: string;
  name: string;
}) {
  try {
    const roast = await generateText({
      model: google("gemini-1.5-flash"),
      prompt: `Write a lighthearted, sarcastic roast for a user named ${name} who has spent too much on their ${category} budget.
      They had a budget of ${budget} specifically for ${category} and have already spent ${spending}.
      The roast should be playful and funny but not too harsh, like friendly banter.
      Make sure the message is concise, no longer than 280 characters, so it's easily digestible.
      Example: "Looks like you’ve spent more on ${category} than you planned, better start selling lemonade on the side!"`,
    });

    return {
      message: roast.text,
      success: true,
    };
  } catch (err) {
    const error = err as Error;
    return { success: false, message: error?.message || "An error occurred" };
  }
}
