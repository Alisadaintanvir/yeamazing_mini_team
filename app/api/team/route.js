import { NextResponse } from "next/server";
import { teamSchema } from "@/utils/zod";
import { withAuth } from "@/lib/with-auth";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { withRateLimit } from "@/lib/withRateLimit";

async function getTeams() {
  const session = await auth();
  try {
    const teams = await prisma.team.findMany({
      where: {},
    });
    return NextResponse.json({ success: true, data: teams });
  } catch (error) {
    return NextResponse.json({ success: false, error });
  }
}

async function addTeam(request) {
  const session = await auth();
  const body = await request.json();
  const result = teamSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      { success: false, errors, message: "Invalid request data" },
      { status: 400 }
    );
  }
  const { name, description } = result.data;

  try {
    // Check if team with same name exists in same user account
    const existingTeam = await prisma.team.findFirst({
      where: { name: name, ownerId: session.user.id },
    });

    if (existingTeam) {
      return NextResponse.json(
        { success: false, error: "Team already exists" },
        { status: 400 }
      );
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        name,
        description,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "ADMIN",
          },
        },
      },
      include: {
        members: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Team created successfully",
      team,
    });
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

// Wrap the handler with withAuth
export const GET = withRateLimit(withAuth(getTeams));
export const POST = withRateLimit(withAuth(addTeam));
