import { API_URL } from "@/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Invalid credentials" },
        { status: response.status }
      );
    }

    const { accessToken, refreshToken, user } = data;

    // Create response and attach HttpOnly cookies
    const res = NextResponse.json({
      success: true,
      message: "Login successful",
      user,
    });

    // Secure cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path: "/",
    };

    res.cookies.set("accessToken", accessToken, cookieOptions);
    res.cookies.set("refreshToken", refreshToken, cookieOptions);

    return res;
    
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Server error, please try again later" },
      { status: 500 }
    );
  }
}
