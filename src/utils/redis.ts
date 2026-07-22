import { createClient, RedisClientType } from 'redis';

// Initialize the strongly-typed client
export const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};
redisClient.on('error', (err) => console.error('Redis Client Error', err));
