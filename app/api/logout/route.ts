import { API_URL } from "@/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Optionally, inform backend to destroy session
    const accessToken = req.cookies.get("accessToken")?.value;
    if (accessToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    // Clear cookies on frontend domain
    const res = NextResponse.json({ success: true, message: "Logout successful" });
    res.cookies.delete("accessToken");
    res.cookies.delete("refreshToken");

    return res;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ success: false, message: "Logout failed" }, { status: 500 });
  }
}
