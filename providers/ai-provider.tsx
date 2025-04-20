import {
  ClientMessage,
  continueConversation,
  ServerMessage,
} from "@/actions/ai/chat";
import { generateId } from "ai";
import { createAI, getAIState } from "ai/rsc";

export const AIProvider = createAI<ServerMessage[], ClientMessage[]>({
  actions: {
    continueConversation,
  },
  // onSetAIState: async ({ state, done }) => {
  //   "use server";

  //   console.log(done);
  //   if (done) {
  //     console.log("Saving state ", state);
  //     // saveChat(state);
  //   }
  // },
  onGetUIState: async () => {
    "use server";

    const history = getAIState() as ServerMessage[];

    return history.map(({ role, content }) => ({
      id: generateId(),
      role,
      display: role === "function" ? <p>{...JSON.parse(content)}</p> : content,
    }));
  },
});
