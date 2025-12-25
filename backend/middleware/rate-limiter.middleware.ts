import { NextRequest } from "next/server";
import {
  InMemoryRateLimitStore,
  RedisRateLimitStore,
} from "../utils/rate-limit-store";
import { PolicyResolver } from "../utils/rate-limit-policy";
import { IdentifierResolver } from "../utils/identifier-resolver";
import type {
  IRateLimitStore,
  RateLimitResult,
  RateLimitHeaders,
} from "../models/rate-limit.model";

/**
 * 🛡️ RATE LIMITER MIDDLEWARE (ENTRY POINT)
 * ---------------------------------------
 * Role: This class is the CENTRAL ORCHESTRATOR. It is called by the main
 * API routes (src/app/api/route.ts) before any controller logic.
 *
 * Flow:
 * 1. Resolves Identity (User ID or IP)
 * 2. Resolves Policy (Quota for the specific endpoint)
 * 3. Checks/Increments Store (Redis or Memory)
 * 4. Returns headers and allowed/denied status
 */
export class RateLimiter {
  private store: IRateLimitStore;
  private policyResolver: PolicyResolver;
  private identifierResolver: IdentifierResolver;

  constructor() {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl && redisUrl.startsWith("redis")) {
      this.store = new RedisRateLimitStore(redisUrl);
      console.log("[RateLimiter] Using Redis storage");
    } else {
      this.store = new InMemoryRateLimitStore();
      console.log("[RateLimiter] Using In-Memory storage");
    }
    this.policyResolver = new PolicyResolver();
    this.identifierResolver = new IdentifierResolver();
  }

  async check(
    req: NextRequest,
    endpoint: string,
    method: string
  ): Promise<RateLimitResult> {
    try {
      const identifier = this.identifierResolver.resolve(req);
      const policy = this.policyResolver.resolve(endpoint, method);
      const key = `${identifier}:${method}:${endpoint}`;

      let entry = await this.store.get(key);
      const now = Date.now();

      if (!entry || entry.resetAt < now) {
        entry = {
          count: 0,
          resetAt: now + policy.windowMs,
        };
        await this.store.set(key, entry);
      }

      if (entry.count >= policy.limit) {
        return {
          allowed: false,
          limit: policy.limit,
          remaining: 0,
          resetAt: entry.resetAt,
        };
      }

      const newCount = await this.store.increment(key);

      return {
        allowed: true,
        limit: policy.limit,
        remaining: policy.limit - newCount,
        resetAt: entry.resetAt,
      };
    } catch (error) {
      console.error("[RateLimiter] Error during check:", error);
      // Fallback: allow request if limiter fails to not block users
      return {
        allowed: true,
        limit: 100,
        remaining: 99,
        resetAt: Date.now() + 60000,
      };
    }
  }

  getHeaders(result: RateLimitResult): RateLimitHeaders {
    const headers: RateLimitHeaders = {
      "X-RateLimit-Limit": result.limit.toString(),
      "X-RateLimit-Remaining": result.remaining.toString(),
      "X-RateLimit-Reset": Math.floor(result.resetAt / 1000).toString(),
    };

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
      headers["Retry-After"] = Math.max(0, retryAfter).toString();
    }

    return headers;
  }
}

