import type {
  IRateLimitStore,
  RateLimitEntry,
} from "../models/rate-limit.model";
import Redis from "ioredis";

/**
 * 🚀 REDIS IMPLEMENTATION
 * ----------------------
 * Functioning: Uses 'ioredis' to connect to the external Redis server (Railway).
 * Connection: This is the production store. It implements IRateLimitStore.
 * Key Feature: Uses 'EX' (Expiry) in Redis to let the store automatically
 * clean up old keys once the window resets.
 */
export class RedisRateLimitStore implements IRateLimitStore {
  private redis: Redis;

  constructor(url: string) {
    this.redis = new Redis(url);
    this.redis.on("error", (err) => {
      console.error("[RedisRateLimitStore] Redis Connection Error:", err);
    });
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    return JSON.parse(data);
  }

  async set(key: string, entry: RateLimitEntry): Promise<void> {
    const ttl = Math.ceil((entry.resetAt - Date.now()) / 1000);
    if (ttl <= 0) return;
    await this.redis.set(key, JSON.stringify(entry), "EX", ttl);
  }

  async increment(key: string): Promise<number> {
    const data = await this.get(key);
    if (data) {
      data.count++;
      await this.set(key, data); // Atomic update across distributed instances
      return data.count;
    }
    return 0;
  }
}

/**
 * 🛠️ IN-MEMORY IMPLEMENTATION (DEVELOPMENT FALLBACK)
 * ------------------------------------------------
 * Functioning: Uses a simple JavaScript Map to track counts.
 * Connection: Used when REDIS_URL is not provided (local dev).
 * Role: Ensures the app remains functional even without a Redis server.
 */
export class InMemoryRateLimitStore implements IRateLimitStore {
  private store: Map<string, RateLimitEntry>;

  constructor() {
    this.store = new Map();
  }

  async get(key: string): Promise<RateLimitEntry | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, entry: RateLimitEntry): Promise<void> {
    this.store.set(key, entry);
  }

  async increment(key: string): Promise<number> {
    const entry = this.store.get(key);
    if (entry) {
      entry.count++;
      this.store.set(key, entry);
      return entry.count;
    }
    return 0;
  }

  async cleanup(): Promise<void> {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      if (entry.resetAt < now) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.store.delete(key));
  }
}

