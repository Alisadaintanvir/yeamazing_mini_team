import { NextResponse } from "next/server";
import { withMiddleware } from "@/lib/withMiddleware";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { auth } from "@/auth";

async function addMember(req) {
  try {
    const { teamId, userId } = await req.json();

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    // Check if user is already a member
    const isAlreadyMember = team.members.some((m) => m.userId === userId);
    if (isAlreadyMember) {
      return NextResponse.json(
        { success: false, message: "User is already a member of this team" },
        { status: 400 }
      );
    }

    const membership = await prisma.teamMembership.create({
      data: {
        team: {
          connect: { id: teamId },
        },
        user: {
          connect: { id: userId },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Member added successfully",
      membership,
    });
  } catch (error) {
    console.error("Error adding team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function removeMember(req) {
  try {
    const { teamId, userId } = await req.json();

    if (!teamId || !userId) {
      return NextResponse.json(
        { success: false, message: "Team ID and User ID are required" },
        { status: 400 }
      );
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    await prisma.teamMembership.delete({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Member removed successfully",
    });
  } catch (error) {
    console.error("Error removing team member:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to remove team member",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const POST = withMiddleware(addMember, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.TEAM.UPDATE],
});

export const DELETE = withMiddleware(removeMember, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.TEAM.UPDATE],
});
