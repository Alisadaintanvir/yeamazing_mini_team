import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

// Create Redis client
const redis = Redis.fromEnv();

// Define rate limiters
const limiters = {
  // API rate limiter (10 requests per 10 seconds)
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, "60 s"),
    analytics: true,
  }),

  // Auth routes rate limiter (5 requests per minute)
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "60 s"),
    analytics: true,
  }),
};

/**
 * Apply rate limiting to API requests
 * @param {Request} req - The request object
 * @param {string} type - The type of rate limiter to use ('api' or 'auth')
 * @param {string} [identifier] - Optional custom identifier (defaults to IP address)
 * @returns {Promise<{response: NextResponse|null, success: boolean, limit: number, remaining: number, reset: number}>}
 */
export async function applyRateLimit(req, type = "api", identifier = null) {
  // Get the appropriate rate limiter
  const limiter = limiters[type] || limiters.api;

  // Use provided identifier or fall back to IP
  const id = identifier || `${type}_${req.ip || "127.0.0.1"}`;

  // Apply rate limiting
  const result = await limiter.limit(id);
  const { success, limit, reset, remaining } = result;

  // If rate limit exceeded, return 429 response
  if (!success) {
    const response = new NextResponse(
      JSON.stringify({
        error:
          type === "auth"
            ? "Too many authentication attempts. Please try again later."
            : "Too many requests",
        limit,
        remaining: 0,
        reset,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": reset.toString(),
          "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
        },
      }
    );

    return { response, success, limit, remaining, reset };
  }

  // Rate limit not exceeded, return success with null response
  return {
    response: null,
    success,
    limit,
    remaining,
    reset,
  };
}

/**
 * Add rate limit headers to a response
 * @param {NextResponse} response - The Next.js response object
 * @param {Object} rateLimitResult - The result from a rate limit check
 * @returns {NextResponse} - Response with added headers
 */
export function addRateLimitHeaders(response, { limit, remaining, reset }) {
  response.headers.set("X-RateLimit-Limit", limit.toString());
  response.headers.set("X-RateLimit-Remaining", remaining.toString());
  response.headers.set("X-RateLimit-Reset", reset.toString());
  return response;
}
