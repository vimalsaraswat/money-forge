import { auth } from "@/auth";
import { SignIn } from "@/components/auth";
import { HeaderHero } from "@/components/heading-hero";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default async function Header() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="bg-background/60 backdrop-blur-sm sticky top-0 z-40 flex w-full items-center border-b">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-2 md:px-4">
        <HeaderHero />
        <nav className="md:space-x-4 flex ml-auto w-auto">
          {user ? (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">
                  <HomeIcon />
                  <span className="sr-only md:not-sr-only">Dashboard</span>
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
