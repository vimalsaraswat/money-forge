import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignIn } from "@/components/auth";
import { auth } from "@/auth";
import Image from "next/image";

export default async function LandingPage() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="h-full container mx-auto flex-col md:flex-row flex gap-4 items-center justify-evenly">
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Welcome to Personal
          <br /> Finance Tracker
        </h1>
        <p className="text-xl mb-2 md:mb-8">
          Take control of your finances with ease and clarity.
        </p>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild variant="secondary">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <SignIn variant="outline">
              <Image
                src="/icons/google.svg"
                alt="Google Logo"
                width={24}
                height={24}
              />
              Get Started
            </SignIn>
          )}
        </div>
      </div>
      <Image
        src={`https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D`}
        height={400}
        width={280}
        className="rounded-md"
        alt="Personal Finance Tracker"
      />
    </div>
  );
}
