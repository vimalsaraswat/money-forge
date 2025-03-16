"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ReactNode } from "react";
import { BotIcon, UserIcon } from "./icons";
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
        className={`flex flex-row gap-2 w-fit max-w-10/12 md:max-w-[500px] bg-card/50 p-2 rounded-md`}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="size-[24px] flex flex-col justify-center items-center flex-shrink-0 text-zinc-400">
          <Image
            width={24}
            height={24}
            src="/logo.webp"
            alt={`Bot avatar`}
            className="rounded-full"
          />
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
  imgUrl,
  content,
}: {
  role: "assistant" | "user";
  imgUrl?: string | null;
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
          {imgUrl ? (
            <Image
              width={24}
              height={24}
              src={imgUrl}
              alt={`${role} avatar`}
              className="rounded-full"
            />
          ) : role === "assistant" ? (
            <BotIcon />
          ) : (
            <UserIcon />
          )}
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
