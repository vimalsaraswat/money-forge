import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosHeaders } from "axios";

export default async function middleware(req: NextRequest) {
  try {
    const origin = new URL(req.url).origin;
    const session = (
      await axios.get(`${origin}/api/auth/session`, {
        headers: req?.headers as unknown as AxiosHeaders,
      })
    )?.data;

    if (!session) {
      return NextResponse.redirect(`${origin}/api/auth/signin`);
    }
    return NextResponse.next();
  } catch (err) {
    const error = err as Error;
    console.error("Error in middleware:", error?.message || "Unknown error");
    return NextResponse.error();
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/chat/:path*"],
};
