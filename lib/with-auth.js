export function withAuth(handler) {
  return async (req, context) => {
    const cookieToken = req.cookies.get("authjs.session-token")?.value;

    // 2. Try to get token from Authorization header
    const authHeader = req.headers.get("authorization");
    const headerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    const token = cookieToken || headerToken;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // If authenticated, call the original handler
    return handler(req, context);
  };
}
