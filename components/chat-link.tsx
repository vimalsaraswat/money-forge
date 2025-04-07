"use client";

import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const ChatLink = () => {
  const pathName = usePathname();

  if (pathName === "/chat") return null;

  return (
    <motion.div className="fixed bottom-3 right-4 md:bottom-5 md:right-6 z-50">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-lime-400 to-pink-400 blur-lg opacity-50 animate-spin"></div>
      <Link href="/chat" className="relative">
        <Sparkles size={28} className="text-accent/80" />
      </Link>
    </motion.div>
  );
};

export default ChatLink;
