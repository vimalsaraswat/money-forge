"use client";

import { Message } from "@/components/message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { type AIProvider } from "@/providers/ai-provider";
import { useActions, useUIState } from "ai/rsc";
import { motion } from "framer-motion";
import { SendIcon, SparklesIcon } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

export default function Chat() {
  const [conversation, setConversation] = useUIState<typeof AIProvider>();
  const { submitUserMessage } = useActions();

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const handleSubmit = async () => {
    if (!(input?.trim()?.length > 0)) {
      toast.warning("Please enter a message");
      return;
    }

    setInput("");
    setConversation((currentConversation) => [
      ...currentConversation,
      <Message key={conversation.length} role="user" content={input} />,
    ]);

    const { success, message } = await submitUserMessage(input);
    if (success) {
      setConversation((currentConversation) => [
        ...currentConversation,
        message,
      ]);
    } else {
      toast.error("Something went wrong, please try again later.");
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1">
      <div className="flex flex-col justify-between gap-2 flex-1 overflow-auto">
        <div
          ref={messagesContainerRef}
          className="flex-1 flex flex-col gap-3 w-full items-center overflow-y-auto pt-20"
        >
          {conversation.length === 0 && (
            <motion.div className="h-[350px] px-4 w-full max-w-md md:px-0">
              <div className="text-lg rounded-lg p-6 flex flex-col gap-4 text-card-foreground bg-card/50">
                <p className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50">
                  <SparklesIcon />
                </p>
                <p className="text-center">
                  Hi, I'm your personal finance chatbot!
                  <br /> I can answer questions about budgeting, saving,
                  investing, and more. What are your financial goals?
                </p>
              </div>
            </motion.div>
          )}
          {conversation.map((message, i) => (
            <React.Fragment key={i}>{message}</React.Fragment>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form action={handleSubmit} className="flex relative items-center">
          <Input
            ref={inputRef}
            placeholder="Ask me about your finance..."
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
            className="pr-10"
            autoFocus
          />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="absolute right-0 bottom-0 opacity-80 cursor-pointer"
          >
            <SendIcon />
          </Button>
        </form>
      </div>
    </div>
  );
}
