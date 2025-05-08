import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { withMiddleware } from "@/lib/withMiddleware";
import { NextResponse } from "next/server";

async function getMessages(req) {
  const session = await auth();
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [{ senderId: session.user.id }, { recipientId: session.user.id }],
      },
    });

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching messages",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

async function createMessage(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recipientId, content } = await req.json();

    if (!recipientId || !content) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        recipientId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating message",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

export const GET = withMiddleware(getMessages, { requireAuth: true });
export const POST = withMiddleware(createMessage, { requireAuth: true });
