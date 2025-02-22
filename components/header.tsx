import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Image from "next/image";
import { SignIn } from "./auth";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { HomeIcon } from "lucide-react";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-secondary/60 backdrop-blur-sm p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-3">
          <Image
            src="/logo.webp"
            alt="MoneyForge Logo"
            className="rounded-xl"
            width={40}
            height={40}
          />
          MoneyForge
        </Link>
        <nav className="space-x-4 flex">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <HomeIcon />
                  <span className="sr-only sm:not-sr-only">Dashboard</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="p-0 sm:px-4 sm:py-2 sm:pl-0"
              >
                <Link href="/profile">
                  <Avatar className="border-accent border-1">
                    <AvatarImage src={user.image!} alt="@shadcn" />
                    <AvatarFallback>
                      {user?.name?.split(" ")?.map((_) => _.charAt(0))}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only md:not-sr-only">
                    {user?.name?.split(" ")[0]}
                  </span>
                </Link>
              </Button>
            </>
          ) : (
            <SignIn />
          )}
        </nav>
      </div>
    </header>
  );
}
