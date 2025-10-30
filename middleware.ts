// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const pathname = req.nextUrl.pathname;

  // If no token, redirect to home
  if (!token) return NextResponse.redirect(new URL("/", req.url));

  try {
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const role = (payload as any).role;

    // Redirect only from /dashboard base path to prevent loops
    if (pathname === "/dashboard") {
      if (role === "USER") return NextResponse.redirect(new URL("/", req.url));
      if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      if (role === "SELLER") return NextResponse.redirect(new URL("/dashboard/seller", req.url));
    }

    // Optional: protect admin/seller routes
    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    else if (pathname.startsWith("/dashboard/seller") && role !== "SELLER") {
      return NextResponse.redirect(new URL("/", req.url));
    }

  } catch (err) {
    console.error("Invalid token", err);
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Apply middleware only to dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"], 
};
