import { NextResponse } from "next/server";
import { withMiddleware } from "@/lib/withMiddleware";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";
import { auth } from "@/auth";
import { teamSchema } from "@/utils/zod";

async function getTeams(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const teams = await prisma.team.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        projects: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.team.count({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    return NextResponse.json({
      success: true,
      teams,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch teams",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function createTeam(req) {
  const session = await auth();
  try {
    const body = await req.json();
    const result = teamSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, errors, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description } = result.data;

    const team = await prisma.team.create({
      data: {
        name: name.trim(),
        description: description?.trim(),
        members: {
          create: {
            user: {
              connect: { id: session.user.id },
            },
          },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Team created successfully",
        team,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create team",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function updateTeam(req) {
  try {
    const body = await req.json();
    const result = teamSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, errors, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { id, name, description } = result.data;

    // Check if user is an admin of the team
    const membership = await prisma.teamMembership.findFirst({
      where: {
        teamId: id,
        userId: session.user.id,
        role: "ADMIN",
      },
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, message: "Only team admins can update team details" },
        { status: 403 }
      );
    }

    const updatedTeam = await prisma.team.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description?.trim(),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Team updated successfully",
      team: updatedTeam,
    });
  } catch (error) {
    console.error("Error updating team:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update team",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function deleteTeam(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Team ID is required" },
        { status: 400 }
      );
    }

    const existingTeam = await prisma.team.findUnique({
      where: { id },
      include: {
        owner: true,
      },
    });

    if (!existingTeam) {
      return NextResponse.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    if (existingTeam.ownerId !== session.user.id) {
      return NextResponse.json(
        { success: false, message: "Only team owner can delete team" },
        { status: 403 }
      );
    }

    await prisma.team.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Team deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting team:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete team",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = withMiddleware(getTeams, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.TEAM.READ],
});

export const POST = withMiddleware(createTeam, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.TEAM.CREATE],
});

export const PATCH = withMiddleware(updateTeam, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.TEAM.UPDATE],
});

export const DELETE = withMiddleware(deleteTeam, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.TEAM.DELETE],
});
