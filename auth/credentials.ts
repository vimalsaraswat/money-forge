import { SignInSchema } from "@/types/zod-schema";
import { type CredentialsConfig } from "next-auth/providers/credentials";
import { ZodError } from "zod";
import bcrypt from "bcryptjs";
import { DB } from "@/db/queries";
import { User } from "next-auth";

export const hashPassword = (password: string) => {
  const saltRounds = 10;
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

export const credentialsConfig = {
  id: "credentials",
  name: "Credentials",
  type: "credentials",
  credentials: {
    email: {},
    password: {},
  },
  authorize: async (credentials) => {
    console.log("Authorize function started");

    try {
      const { email, password } = await SignInSchema.parseAsync(credentials);
      console.log("Credentials parsed successfully:", email);

      const userArray = await DB.getUserByEmail(email);
      const user = userArray && userArray.length > 0 ? userArray[0] : null;
      console.log("User retrieved from DB:", user);

      if (!user || !user?.password) {
        console.log("No user found or user has no password");
        return null;
      }

      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (passwordsMatch) {
        console.log("Passwords match for user:", user.email);
        const userToReturn = {
          // Create a dedicated variable for logging
          id: user.id,
          name: user.name,
          email: user.email,
          image: user?.image,
          credits: user.credits || 0,
        } satisfies User;
        console.log("Authorize function returning user:", userToReturn); // <--- ADD THIS LOG
        return userToReturn;
      } else {
        console.log("Passwords do not match for user:", user.email);
        return null;
      }
    } catch (error) {
      console.log("Error in authorize function: ", error);
      if (error instanceof ZodError) {
        console.log("ZodError during authorization:", error.errors);
        return null;
      }
      console.log("Unexpected error during authorization:", error);
      return null;
    }
  },
} satisfies CredentialsConfig;
