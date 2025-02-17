import { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  if (!req?.cookies?.get("authjs.session-token")) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
}

export const config = {
  matcher: ["/dashboard", "/profile"],
};
