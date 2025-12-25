/**
 * 📊 RATE LIMITING DATA MODELS
 * ----------------------------
 * These interfaces define the data structures used by the Rate Limiter system.
 * This ensures type safety across both Redis and In-Memory storage implementations.
 */

// Rate limit entry stored in persisting layer (Redis or Memory)
export interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp in milliseconds
}

// Configuration for specific endpoint quotas
export interface RateLimitPolicy {
  limit: number; // Max requests allowed in the window
  windowMs: number; // Time frame in milliseconds (e.g., 900,000 for 15 mins)
  endpoint: string; // The normalized API path
  method: string; // HTTP method (GET, POST, etc.)
}

// Result returned by rate limiter
export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

// Headers to attach to response
export interface RateLimitHeaders {
  "X-RateLimit-Limit": string;
  "X-RateLimit-Remaining": string;
  "X-RateLimit-Reset": string;
  "Retry-After"?: string; // Only when limit exceeded
  [key: string]: string | undefined;
}

/**
 * 🧱 STORAGE CONTRACT (INTERFACE)
 * ------------------------------
 * This follows the Dependency Inversion Principle.
 * The main RateLimiter doesn't care if we use Redis or Memory;
 * it only knows that the "Store" has these methods.
 */
export interface IRateLimitStore {
  get(key: string): Promise<RateLimitEntry | null>; // Retrieve current counts
  set(key: string, entry: RateLimitEntry): Promise<void>; // Save/Update counts
  increment(key: string): Promise<number>; // Atomic increment
  cleanup?(): Promise<void>; // Optional: maintenance for JS Map
}

