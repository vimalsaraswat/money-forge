import { signIn, signOut } from "@/auth";
import { Button } from "./ui/button";
import Image from "next/image";

export function SignIn({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <form
      className="p-0 w-fit"
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/dashboard",
          prompt: "consent",
        });
      }}
    >
      <Button variant="ghost" {...props} type="submit">
        {props?.children ?? (
          <>
            <Image
              src="/icons/google.svg"
              alt="Google Logo"
              width={24}
              height={24}
            />
            <span className="sr-only md:not-sr-only">Sign Up</span>
          </>
        )}
      </Button>
    </form>
  );
}

export function SignOut({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <form
      className="p-0 w-fit"
      action={async () => {
        "use server";
        await signOut({
          redirectTo: "/",
        });
      }}
    >
      <Button variant="ghost" {...props} type="submit">
        {props?.children ?? "Logout"}
      </Button>
    </form>
  );
}
