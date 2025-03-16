import { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  providers: [Google],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    session({ session, user }) {
      session.user.credits = user.credits;
      return session;
    },
  },
};
