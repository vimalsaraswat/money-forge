"use client";

import { motion } from "framer-motion";
import { BotIcon, UserIcon } from "./icons";
import { ReactNode } from "react";
import { StreamableValue, useStreamableValue } from "ai/rsc";
import { Markdown } from "./markdown";

export const TextStreamMessage = ({
  content,
}: {
  content: string;
  // content: StreamableValue;
}) => {
  // const [text] = useStreamableValue(content);

  return (
    <div className="w-full flex items-center justify-end">
      <motion.div
        className={`flex flex-row gap-2 w-max max-w-10/12 md:max-w-[500px] bg-card/50 p-2 rounded-md`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
          <BotIcon />
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="text-zinc-800 dark:text-zinc-300 flex flex-col gap-4">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const Message = ({
  role,
  content,
}: {
  role: "assistant" | "user";
  content: string | ReactNode;
}) => {
  return (
    <div className="w-full flex items-center justify-start">
      <motion.div
        className={`flex flex-row gap-2 w-max max-w-10/12 md:max-w-[500px] bg-card/50 p-2 rounded-md overflow-hidden`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
          {role === "assistant" ? <BotIcon /> : <UserIcon />}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <p className="text-card-foreground text-wrap flex flex-col gap-4">
            {content}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
