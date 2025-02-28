"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const HeaderHero = () => {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" && (
        <>
          <SidebarTrigger className="cursor-pointer" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </>
      )}

      <Link
        href="/"
        className="text-md md:text-xl font-bold flex items-center gap-1 md:gap-3"
      >
        <Image
          src="/logo.webp"
          alt="MoneyForge Logo"
          className="rounded-xl size-6 md:size-8"
          width={40}
          height={40}
        />
        <span>MoneyForge</span>
      </Link>
    </>
  );
};
