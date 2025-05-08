import { NextResponse } from "next/server";
import { withMiddleware } from "@/lib/withMiddleware";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";

async function getUsers(req) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        permissions: true,
        teams: {
          select: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
            role: true,
          },
        },
        ownedTeams: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function updateUserRole(req) {
  try {
    const body = await req.json();
    const { id, role, permissions } = body;

    if (!id || !role) {
      return NextResponse.json(
        { success: false, message: "User ID and role are required" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
        ...(permissions && { permissions }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        permissions: true,
        teams: {
          select: {
            team: {
              select: {
                id: true,
                name: true,
              },
            },
            role: true,
          },
        },
        ownedTeams: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "User role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user role",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = withMiddleware(getUsers, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.USER.READ],
});

export const PATCH = withMiddleware(updateUserRole, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.USER.UPDATE],
});
