"use client";

import { Message } from "@/components/message";
import { Input } from "@/components/ui/input";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { type AIProvider } from "@/providers/ai-provider";
import { useActions, useUIState } from "ai/rsc";
import { motion } from "framer-motion";
import { Loader, SendIcon, SparklesIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";
import SubmitButton from "./forms/submit-button";
import Image from "next/image";

export default function Chat() {
  const { data: session } = useSession();
  const [conversation, setConversation] = useUIState<typeof AIProvider>();
  const { submitUserMessage } = useActions();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (!(input?.trim()?.length > 0)) {
        toast.warning("Please enter a message");
        return;
      }

      setInput("");
      setConversation((currentConversation) => [
        ...currentConversation,
        <Message
          key={conversation.length}
          role="user"
          imgUrl={session?.user?.image}
          content={input}
        />,
      ]);

      const { success, message } = await submitUserMessage(input);
      if (success) {
        setConversation((currentConversation) => [
          ...currentConversation,
          message,
        ]);
      } else {
        toast.error(message || "Something went wrong, please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center flex-1 max-w-3xl mx-auto">
      <div className="flex flex-col justify-between gap-2 flex-1 overflow-auto">
        <div
          ref={messagesContainerRef}
          className="flex-1 flex flex-col gap-3 w-full items-center overflow-y-auto pt-16"
        >
          {conversation.length === 0 && (
            <motion.div
              className="h-[350px] px-4 w-full max-w-md md:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                className="text-lg rounded-lg p-6 flex flex-col gap-4 text-card-foreground bg-card/50"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <motion.p
                  className="flex flex-row justify-center gap-4 items-center text-zinc-900 dark:text-zinc-50"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  {session?.user?.image ? (
                    <Image
                      width={40}
                      height={40}
                      src={session?.user?.image}
                      alt={"User avatar"}
                      className="rounded-full"
                    />
                  ) : (
                    <SparklesIcon size={40} className="animate-bounce" />
                  )}
                </motion.p>
                <motion.p
                  className="text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  Hi {session?.user?.name || "there"},<br /> I&apos;m your
                  personal finance buddy!
                  <br /> I can answer questions about budgeting, saving,
                  investing, and more.
                </motion.p>
              </motion.div>
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
          <SubmitButton
            size="icon"
            variant="outline"
            content={<SendIcon />}
            loading={<Loader className="animate-spin" />}
            className="absolute right-0 bottom-0 opacity-80 cursor-pointer"
          />
        </form>
      </div>
    </div>
  );
}
