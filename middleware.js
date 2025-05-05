import { NextResponse } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/dashboard", "/message"];
const authRoutes = ["/login", "/registration"];

export default async function middleware(req) {
  const session = await auth();
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
    );
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
