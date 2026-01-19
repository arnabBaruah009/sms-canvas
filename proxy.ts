import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "./lib/utils/sessions.utils";

export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  const url = request.nextUrl;

  if (url.pathname === "/" || url.pathname === "/auth") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    !cookie &&
    url.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (
    cookie &&
    (url.pathname === "/auth/login" || url.pathname === "/auth/register")
  ) {
    return NextResponse.redirect(
      new URL("/dashboard/home", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/auth",
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
