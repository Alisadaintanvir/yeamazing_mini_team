// lib/withRateLimit.ts

import { addRateLimitHeaders, applyRateLimit } from "./rateLimiter";

export function withRateLimit(handler, type = "api") {
  return async function (req) {
    const { response, success, limit, remaining, reset } = await applyRateLimit(
      req,
      type
    );

    if (!success) return response;

    const res = await handler(req);
    return addRateLimitHeaders(res, { limit, remaining, reset });
  };
}
