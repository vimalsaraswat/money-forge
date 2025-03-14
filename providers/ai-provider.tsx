import { createAI } from "ai/rsc";
import { submitUserMessage } from "@/actions/ai/chat";

export const AIProvider = createAI<any[], React.ReactNode[]>({
  initialUIState: [],
  initialAIState: [],
  actions: {
    submitUserMessage,
  },
});
