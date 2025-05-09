import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  try {
    const session = await auth();

    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only administrators can delete users" },
        { status: 403 }
      );
    }

    const userId = params.id;

    // Prevent self-deletion
    if (userId === session.user.id) {
      return NextResponse.json(
        { success: false, message: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete user's messages first
    await prisma.message.deleteMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
      },
    });

    // Delete user's team memberships
    await prisma.teamMembership.deleteMany({
      where: { userId: userId },
    });

    // Delete the user
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}
