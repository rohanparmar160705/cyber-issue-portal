import { NextRequest } from 'next/server';
import { InMemoryRateLimitStore } from '../utils/rate-limit-store';
import { PolicyResolver } from '../utils/rate-limit-policy';
import { IdentifierResolver } from '../utils/identifier-resolver';
import type {
  IRateLimitStore,
  RateLimitResult,
  RateLimitHeaders,
  RateLimitEntry
} from '../models/rate-limit.model';

export class RateLimiter {
  private store: IRateLimitStore;
  private policyResolver: PolicyResolver;
  private identifierResolver: IdentifierResolver;

  constructor() {
    this.store = new InMemoryRateLimitStore();
    this.policyResolver = new PolicyResolver();
    this.identifierResolver = new IdentifierResolver();
  }

  async check(req: NextRequest, endpoint: string, method: string): Promise<RateLimitResult> {
    // 1. Get identifier (user:5 or ip:192.168.1.1)
    const identifier = this.identifierResolver.resolve(req);

    // 2. Get policy for this endpoint
    const policy = this.policyResolver.resolve(endpoint, method);

    console.log(`[RateLimiter] Incoming: ${method} ${endpoint} | ID: ${identifier}`);

    // 3. Create storage key
    const key = `${identifier}:${method}:${endpoint}`;

    // 4. Get current entry from store
    let entry = this.store.get(key);
    const now = Date.now();

    // 5. Check if window expired or new entry
    if (!entry || entry.resetAt < now) {
      entry = {
        count: 0,
        resetAt: now + policy.windowMs
      };
      this.store.set(key, entry);
      console.log(`[RateLimiter] New window started for ${identifier} on ${endpoint}`);
    }

    // 6. Check if limit exceeded
    if (entry.count >= policy.limit) {
      console.error(`[RateLimiter] BLOCK: ${identifier} exceeded limit (${policy.limit}) on ${endpoint}`);
      return {
        allowed: false,
        limit: policy.limit,
        remaining: 0,
        resetAt: entry.resetAt
      };
    }

    // 7. Increment counter
    entry.count++;
    this.store.set(key, entry);
    
    // Log storage (Note: currently using InMemoryStore, ready for Redis swap)
    console.log(`[RateLimiter] ACCEPT: ${identifier} (${entry.count}/${policy.limit}) | Stored in memory`);

    // 8. Return success
    return {
      allowed: true,
      limit: policy.limit,
      remaining: policy.limit - entry.count,
      resetAt: entry.resetAt
    };
  }

  getHeaders(result: RateLimitResult): RateLimitHeaders {
    const headers: RateLimitHeaders = {
      'X-RateLimit-Limit': result.limit.toString(),
      'X-RateLimit-Remaining': result.remaining.toString(),
      'X-RateLimit-Reset': Math.floor(result.resetAt / 1000).toString()
    };

    if (!result.allowed) {
      const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);
      headers['Retry-After'] = retryAfter.toString();
    }

    return headers;
  }
}