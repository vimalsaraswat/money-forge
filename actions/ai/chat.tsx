import { TextStreamMessage } from "@/components/message";
import { google } from "@ai-sdk/google";
import { streamUI } from "ai/rsc";

export async function submitUserMessage(input: string) {
  "use server";

  try {
    const ui = await streamUI({
      model: google("gemini-1.5-flash"),
      system: "you are a personal finance management assistant",
      prompt: input,
      text: ({ content }) => <TextStreamMessage content={content} />,
    });

    return {
      message: ui.value,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
