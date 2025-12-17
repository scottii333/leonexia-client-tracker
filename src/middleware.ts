import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (req: NextRequest) => {
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    const isAuthenticated = req.cookies.get("auth")?.value === "1";
    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/dashboard/:path*"],
};
