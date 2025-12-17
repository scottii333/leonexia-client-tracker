import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { username, password } = await req.json();

    const validUser = process.env.ADMIN_USERNAME;
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validUser || !validPass) {
      return NextResponse.json(
        {
          success: false,
          message: "Server is not configured. Missing env vars.",
        },
        { status: 500 }
      );
    }

    if (username === validUser && password === validPass) {
      const res = NextResponse.json({ success: true });
      res.cookies.set("auth", "1", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day
      });
      return res;
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Bad request" },
      { status: 400 }
    );
  }
};
