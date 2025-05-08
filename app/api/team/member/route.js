import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/lib/with-auth";
import { withRateLimit } from "@/lib/withRateLimit";
import { addTeamMemberSchema } from "@/utils/zod";

async function addTeamMember(request) {
  const session = await auth();
  const body = await request.json();
  const result = addTeamMemberSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return NextResponse.json(
      { success: false, errors, message: "Invalid request data" },
      { status: 400 }
    );
  }
  const { email, role, teamId } = result.data;

  try {
    const isTeamAdmin = await prisma.teammembership.findFirst({
      where: {
        userId: session.user.id,
        teamId: teamId,
        role: "ADMIN",
      },
    });

    if (!isTeamAdmin) {
      return NextResponse.json(
        { success: false, error: "Access denied. You are not a team admin" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User does not exist" },
        { status: 400 }
      );
    }

    const existingTeamMember = await prisma.teammembership.findFirst({
      where: {
        userId: existingUser.id,
        teamId: teamId,
      },
    });

    if (existingTeamMember) {
      return NextResponse.json(
        { success: false, error: "User already exists in team" },
        { status: 400 }
      );
    }

    await prisma.teammembership.create({
      data: {
        userId: existingUser.id,
        teamId: teamId,
        role: role,
      },
    });

    return NextResponse.json(
      { success: true, message: "Team member added successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { success: false, error: "An error occurred" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(withAuth(addTeamMember));
