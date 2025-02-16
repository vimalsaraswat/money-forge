import NextAuth from "next-auth";
import { authConfig } from "./auth/config";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
  return Response.redirect(newUrl);
});

export const config = {
  matcher: ["/dashboard", "/profile"],
};
