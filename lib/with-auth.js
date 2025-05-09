import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

export function withAuth(handler) {
  return async (req, context) => {
    try {
      // 1. Try to get token from Authorization header (for external API calls)
      const authHeader = req.headers.get("authorization");
      const headerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.slice(7)
        : null;

      // 2. Try to get token from cookie (for Next.js app)
      const cookieToken = req.cookies.get("authjs.session-token")?.value;

      const token = headerToken || cookieToken;
      console.log("token", token);

      if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      let user = null;

      // First try to get session from NextAuth
      const session = await auth();

      if (session?.user) {
        // If we have a valid NextAuth session, use that
        user = session.user;
      } else {
        // If no session, validate the JWT token
        try {
          // Verify the JWT token
          const decoded = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
          });

          // Get user from database
          user = await prisma.user.findUnique({
            where: {
              id: decoded.id,
            },
          });

          if (!user) {
            return NextResponse.json(
              { error: "User not found" },
              { status: 401 }
            );
          }
        } catch (error) {
          console.error("Token validation error:", error);
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
      }

      // Add user to request for downstream handlers
      req.user = user;

      // If authenticated, call the original handler
      return handler(req, context);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
