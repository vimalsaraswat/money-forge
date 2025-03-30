import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";

const EmptyStateCard = ({
  heading,
  description,
  href,
  addText,
}: {
  heading: string;
  description: string;
  href: string;
  addText: string;
}) => (
  <motion.div
    className="text-center flex flex-col gap-2 items-center justify-center h-full py-20 rounded-lg max-w-[80%] mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    <AlertCircle className="h-10 w-10 text-secondary-foreground" />
    <h3 className="text-lg font-semibold text-foreground">{heading}</h3>
    <p className="text-sm text-secondary-foreground">{description}</p>
    <Button variant="outline" size="sm" asChild className="cursor-pointer">
      <Link href={href}>
        <Plus size={28} className="mr-2 h-4 w-4" /> {addText}
      </Link>
    </Button>
  </motion.div>
);

export default EmptyStateCard;
