"use client";

import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const ChatLink = () => {
  const pathName = usePathname();

  if (pathName === "/chat") return null;

  return (
    <motion.div className="fixed bottom-3 right-4 md:bottom-5 md:right-6 z-50 animate-bounce">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-lg opacity-50 animate-pulse"></div>
      <Link href="/chat" className="animate-pulse relative">
        <Sparkles size={36} className="text-accent-foreground" />
      </Link>
    </motion.div>
  );
};

export default ChatLink;
