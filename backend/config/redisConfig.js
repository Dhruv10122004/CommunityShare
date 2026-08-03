const Redis = require('ioredis');

const createRedisReadyPromise = (redisClient) => {
    if (!redisClient) {
        return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
        const onReady = () => {
            cleanup();
            resolve();
        };

        const onError = (err) => {
            cleanup();
            reject(err);
        };

        const cleanup = () => {
            redisClient.off('ready', onReady);
            redisClient.off('error', onError);
        };

        redisClient.once('ready', onReady);
        redisClient.once('error', onError);
    });
};

if (!process.env.REDIS_URL) {
    module.exports = {
        redis: null,
        redisReady: Promise.resolve(),
    };
} else {
    const redis = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 5,
        enableOfflineQueue: true,
        lazyConnect: false,
        retryStrategy(times) {
            return Math.min(times * 1000, 5000);
        },
    });

    redis.on('connect', () => console.log('Redis connected'));
    redis.on('ready', () => console.log('Redis ready'));
    redis.on('error', (err) => console.error('Redis error: ', err.message));

    module.exports = {
        redis,
        redisReady: createRedisReadyPromise(redis),
    };
}