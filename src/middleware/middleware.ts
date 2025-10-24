import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the user is authenticated
  const user =
    request.cookies.get("user") ||
    (typeof window !== "undefined" ? localStorage.getItem("user") : null);

  // If trying to access dashboard without authentication
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If user is authenticated and trying to access login page
  if (request.nextUrl.pathname === "/") {
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
