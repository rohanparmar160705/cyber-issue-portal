// Rate limit entry stored in memory
export interface RateLimitEntry {
  count: number;
  resetAt: number; // Unix timestamp
}

// Policy configuration
export interface RateLimitPolicy {
  limit: number;
  windowMs: number;
  endpoint: string;
  method: string;
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
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'Retry-After'?: string; // Only when limit exceeded
  [key: string]: string | undefined;
}

// Store interface for abstraction
export interface IRateLimitStore {
  get(key: string): RateLimitEntry | null;
  set(key: string, entry: RateLimitEntry): void;
  increment(key: string): number;
  cleanup(): void;
}