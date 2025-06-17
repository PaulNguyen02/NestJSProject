import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CachingService {
  private readonly redis: Redis;

  constructor() {
    const host = process.env.REDIS_HOST || 'localhost';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    this.redis = new Redis({ host, port });
  }

  async get(key: string): Promise<any> {
    const cachedValue = await this.redis.get('someKey');
    if (cachedValue !== null) {
    const parsed = JSON.parse(cachedValue); // chắc chắn không null
    return parsed;
    }
    return null;
  }

  async set(key: string, value: any, ttl = 60): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}