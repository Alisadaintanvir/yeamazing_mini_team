import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher";

// Add runtime configuration
export const runtime = "edge"; // or 'nodejs' if you prefer

// Add dynamic configuration
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { recipientId, content, attachments } = await req.json();

    if (!recipientId) {
      return NextResponse.json(
        { success: false, message: "Recipient ID is required" },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        recipientId,
        attachments: attachments || [],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Trigger Pusher event
    const channelName = `private-chat-${[session.user.id, recipientId]
      .sort()
      .join("-")}`;
    await pusherServer.trigger(channelName, "new-message", message);

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [{ senderId: session.user.id }, { recipientId: userId }],
          },
          {
            AND: [{ senderId: userId }, { recipientId: session.user.id }],
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
