import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CachingService {
  private readonly redis: Redis;

  constructor() {
    this.redis = new Redis({ host: 'localhost', port: 6379 });
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