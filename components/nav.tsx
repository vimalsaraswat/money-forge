import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";

export default async function Nav() {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <nav className="bg-secondary p-4">
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
        <div className="space-x-4 flex">
          {userId && (
            <>
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href={`/profile/${userId}`}>Profile</Link>
              </Button>
            </>
          )}
          {userId ? (
            <form
              className="p-0 w-fit"
              action={async () => {
                "use server";
                await signOut({
                  redirectTo: "/",
                });
              }}
            >
              <Button type="submit" variant="ghost">
                Logout
              </Button>
            </form>
          ) : (
            <form
              className="p-0 w-fit"
              action={async () => {
                "use server";
                await signIn("google", {
                  redirectTo: "/dashboard",
                });
              }}
            >
              <Button type="submit" variant="outline">
                Sign in with Google
              </Button>
            </form>
          )}
        </div>
      </div>
    </nav>
  );
}
