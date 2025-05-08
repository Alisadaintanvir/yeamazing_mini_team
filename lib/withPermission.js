import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export function withPermission(handler, requiredPermissions) {
  return async (req) => {
    try {
      let user = null;

      // First try to get session from NextAuth
      const session = await auth();

      if (session?.user) {
        // If we have a valid NextAuth session, use that
        user = session.user;
      } else {
        // If no session, try to get user from the request (set by withAuth middleware)
        user = req.user;

        // If still no user, try to get from token
        if (!user) {
          const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET,
          });

          if (token) {
            user = await prisma.user.findUnique({
              where: { id: token.id },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                permissions: true,
              },
            });
          }
        }
      }

      // Ensure user exists
      if (!user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      // Check if user is admin or superadmin
      const isAdmin = user.role === "ADMIN";
      if (isAdmin) {
        return handler(req);
      }

      // Get user permissions
      const userPermissions = user.permissions || [];

      // Check if user has all required permissions
      const hasAllPermissions = requiredPermissions.every((permission) =>
        userPermissions.includes(permission)
      );

      if (!hasAllPermissions) {
        return NextResponse.json(
          { message: "Access denied!" },
          { status: 403 }
        );
      }

      // If all checks pass, proceed with the handler
      return handler(req);
    } catch (error) {
      console.error("Permission check error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
