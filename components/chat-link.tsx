"use client";

import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const ChatLink = () => {
  const pathName = usePathname();

  if (pathName === "/chat") return null;

  return (
    <motion.div className="fixed bottom-2 right-2 z-50 animate-bounce">
      <Link href="/chat" className="">
        <Sparkles />
      </Link>
    </motion.div>
  );
};

export default ChatLink;
