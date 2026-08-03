const Redis = require('ioredis');

if (!process.env.REDIS_URL) {
    module.exports = null;
} else {
    const redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        enableOfflineQueue: false,
    });

    redis.on('connect', () => console.log('Redis connected'));
    redis.on('error', (err) => console.error('Redis error: ', err.message));

    module.exports = redis;
}