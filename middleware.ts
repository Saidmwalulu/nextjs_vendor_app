// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  // If no token, block access
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jose.jwtVerify(token, secret);

    // Token valid → allow access
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid or expired token:", err);
    const res = NextResponse.redirect(new URL("/", req.url));
    res.cookies.delete("accessToken"); // clear bad token
    return res;
  }
}

// Protect all dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
