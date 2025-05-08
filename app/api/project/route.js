import { NextResponse } from "next/server";
import { withMiddleware } from "@/lib/withMiddleware";
import { projectSchema } from "@/utils/zod";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";

async function createProject(req) {
  try {
    const body = await req.json();
    const result = projectSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        { success: false, errors, message: "Invalid request data" },
        { status: 400 }
      );
    }

    const { name, description, status, priority, dueDate, teamId } =
      result.data;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
      include: {
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Project created successfully",
        project,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create project",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function getProjects(req) {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch projects",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const POST = withMiddleware(createProject, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.PROJECT.CREATE],
});

export const GET = withMiddleware(getProjects, {
  requireAuth: true,
  rateLimit: true,
  requiredPermissions: [PERMISSIONS.PROJECT.READ],
});
