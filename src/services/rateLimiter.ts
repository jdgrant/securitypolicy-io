interface RateLimitEntry {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

interface RateLimitConfig {
  windowMs: number;
  maxAttempts: number;
}

class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private configs: Map<string, RateLimitConfig>;

  constructor() {
    this.store = new Map();
    this.configs = new Map();

    // Set default rate limit configurations
    this.setConfig('verification', { windowMs: 5 * 60 * 1000, maxAttempts: 5 }); // 5 attempts per 5 minutes
    this.setConfig('password-reset', { windowMs: 60 * 60 * 1000, maxAttempts: 3 }); // 3 attempts per hour
    this.setConfig('login', { windowMs: 15 * 60 * 1000, maxAttempts: 5 }); // 5 attempts per 15 minutes

    // Clean up expired entries every minute
    setInterval(() => this.cleanup(), 60 * 1000);
  }

  setConfig(key: string, config: RateLimitConfig): void {
    this.configs.set(key, config);
  }

  private getKey(type: string, identifier: string): string {
    return `${type}:${identifier}`;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      const [type] = key.split(':');
      const config = this.configs.get(type);
      if (config && now - entry.firstAttempt > config.windowMs) {
        this.store.delete(key);
      }
    }
  }

  attempt(type: string, identifier: string): { success: boolean; msBeforeNext?: number } {
    const key = this.getKey(type, identifier);
    const config = this.configs.get(type);

    if (!config) {
      throw new Error(`No rate limit configuration found for type: ${type}`);
    }

    const now = Date.now();
    const entry = this.store.get(key) || { count: 0, firstAttempt: now, lastAttempt: now };

    // Reset if window has expired
    if (now - entry.firstAttempt > config.windowMs) {
      entry.count = 0;
      entry.firstAttempt = now;
    }

    entry.count++;
    entry.lastAttempt = now;
    this.store.set(key, entry);

    if (entry.count > config.maxAttempts) {
      const msBeforeNext = (entry.firstAttempt + config.windowMs) - now;
      return { success: false, msBeforeNext };
    }

    return { success: true };
  }

  getRemainingAttempts(type: string, identifier: string): number {
    const key = this.getKey(type, identifier);
    const config = this.configs.get(type);

    if (!config) {
      throw new Error(`No rate limit configuration found for type: ${type}`);
    }

    const entry = this.store.get(key);
    if (!entry) {
      return config.maxAttempts;
    }

    const now = Date.now();
    if (now - entry.firstAttempt > config.windowMs) {
      return config.maxAttempts;
    }

    return Math.max(0, config.maxAttempts - entry.count);
  }
}

export const rateLimiter = new RateLimiter(); 