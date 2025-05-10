import PusherClient from "pusher-js";

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    authEndpoint: "/api/pusher/auth",
    auth: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    enabledTransports: ["ws", "wss"],
    disabledTransports: ["xhr_streaming", "xhr_polling"],
    forceTLS: true,
    activityTimeout: 30000,
    pongTimeout: 10000,
    maxReconnectionAttempts: 6,
    maxReconnectGap: 10000,
  }
);

// Add connection event listeners
pusherClient.connection.bind("connected", () => {
  console.log("Pusher connected successfully");
});

pusherClient.connection.bind("error", (err) => {
  console.error("Pusher connection error:", err);
});

pusherClient.connection.bind("disconnected", () => {
  console.log("Pusher disconnected");
});

pusherClient.connection.bind("connecting", () => {
  console.log("Pusher connecting...");
});
