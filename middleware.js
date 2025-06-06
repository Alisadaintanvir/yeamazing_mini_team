import { NextResponse } from "next/server";
import { auth } from "./auth";
import { ROUTE_PERMISSIONS } from "./lib/constants";

const authRoutes = ["/login", "/registration"];

export default async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = await auth();

  // Check if it's an auth route (login/registration)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute) {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // Check if the route requires authentication
  const isProtectedRoute = Object.keys(ROUTE_PERMISSIONS).some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // If not authenticated, redirect to login
    if (!session) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url)
      );
    }

    // Check role-based access
    const userRole = session.user.role;
    const allowedRoles = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (!allowedRoles?.includes(userRole)) {
      // If user doesn't have required role, redirect to dashboard
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.png$).*)", // Your existing matcher
    "/api/:path*", // Add API routes
  ],
};
