import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { withMiddleware } from "@/lib/withMiddleware";

async function pusherAuth(req) {
  try {
    // Get raw body text
    const rawBody = await req.text();

    // Parse the raw body manually
    const params = new URLSearchParams(rawBody);
    const socketId = params.get("socket_id");
    const channel = params.get("channel_name");

    if (!socketId || !channel) {
      console.error("Missing socket_id or channel_name", { socketId, channel });
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Authorize the channel
    const authResponse = pusherServer.authorizeChannel(socketId, channel);

    console.log("Channel authorized successfully");
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Error authorizing Pusher channel:", {
      error: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { success: false, message: "Failed to authorize channel" },
      { status: 500 }
    );
  }
}

export const POST = withMiddleware(pusherAuth, {
  requireAuth: true,
});
