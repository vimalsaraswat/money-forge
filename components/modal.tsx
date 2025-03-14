"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { DialogContent } from "./ui/dialog";

export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const handleClose = () => {
    router.back();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed p-3 cursor-pointer w-[100dvw] h-[100dvh] inset-0 z-50 flex items-end justify-end md:justify-center md:items-center bg-black/50 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "relative radial-gradient(circle 500px at 5% 5%, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.04))",
        }}
        className="border cursor-auto bg-card/50 p-2 rounded-[8px] w-sm sm:w-lg md:w-2xl aspect-[1/1.4] md:aspect-[14/10] overflow-hidden flex items-center justify-center relative"
      >
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute right-2 top-2 rounded-lg bg-opacity-50 z-50 cursor-pointer"
          onClick={handleClose}
        >
          <X className="text-destructive" />
        </Button>

        <div className="flex h-full md:p-2 self-stretch flex-1">{children}</div>
      </div>
    </div>
  );
}
