import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private cache = new Map<string, { value: string; expiry: number | null }>();

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async delPattern(pattern: string): Promise<void> {
    // Convert Redis glob pattern (e.g. user:*:analytics:*) to a regex
    const regexPattern = new RegExp(
      '^' + pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&').replace(/\\\*/g, '.*') + '$',
    );

    for (const key of this.cache.keys()) {
      if (regexPattern.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}
