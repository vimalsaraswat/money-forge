import { NextAuthConfig } from "next-auth";
// import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
// import Nodemailer from "next-auth/providers/nodemailer";
// import Passkey from "next-auth/providers/passkey";
// import { credentialsConfig } from "./credentials";

export const authConfig: NextAuthConfig = {
  providers: [
    Google,
    // Passkey,
    // Credentials(credentialsConfig),
    // Nodemailer({
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
    session({ session, user }) {
      session.user.credits = user.credits;
      return session;
    },
  },
  // experimental: { enableWebAuthn: true },
};
