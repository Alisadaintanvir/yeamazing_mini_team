import { withRateLimit } from "./withRateLimit";
import { withAuth } from "./with-auth";
import { withPermission } from "./withPermission";

export function withMiddleware(handler, options = {}) {
  const {
    rateLimit = true,
    rateLimitType = "api",
    requireAuth = false,
    requiredPermissions = [],
  } = options;

  let wrappedHandler = handler;

  // Apply permission check if required
  if (requiredPermissions.length > 0) {
    wrappedHandler = withPermission(wrappedHandler, requiredPermissions);
  }

  // Apply auth check if required
  if (requireAuth || requiredPermissions.length > 0) {
    wrappedHandler = withAuth(wrappedHandler);
  }

  // Apply rate limiting if required
  if (rateLimit) {
    wrappedHandler = withRateLimit(wrappedHandler, rateLimitType);
  }

  return wrappedHandler;
}
