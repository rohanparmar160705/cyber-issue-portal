import type { IRateLimitStore, RateLimitEntry } from '../models/rate-limit.model';

export class InMemoryRateLimitStore implements IRateLimitStore {
  private store: Map<string, RateLimitEntry>;
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    this.store = new Map();
    
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 300000); // 5 minutes
  }

  get(key: string): RateLimitEntry | null {
    return this.store.get(key) || null;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  increment(key: string): number {
    const entry = this.store.get(key);
    if (entry) {
      entry.count++;
      this.store.set(key, entry);
      return entry.count;
    }
    return 0;
  }

  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      if (entry.resetAt < now) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.store.delete(key));
    
    if (keysToDelete.length > 0) {
      console.log(`[RateLimitStore] Cleaned up ${keysToDelete.length} expired entries`);
    }
  }

  // Cleanup on destroy
  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}