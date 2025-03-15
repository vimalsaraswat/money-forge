"use client";

import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

const ChatLink = () => {
  const pathName = usePathname();

  if (pathName === "/chat") return null;

  return (
    <motion.div className="fixed bottom-3 right-4 z-50 animate-bounce">
      <Link href="/chat" className="animate-pulse">
        <Sparkles size={36} className="text-accent-foreground" />
      </Link>
    </motion.div>
  );
};

export default ChatLink;
