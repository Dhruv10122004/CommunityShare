const { redis, redisReady } = require('../config/redisConfig');

const getCacheKey = (req) => {
  return `cache:${req.originalUrl}:${JSON.stringify(req.query || {})}`;
};

exports.cacheResponse = (ttlSeconds = 60) => async (req, res, next) => {
  if (!redis) {
    return next();
  }

  try {
    await redisReady;

    const key = getCacheKey(req);
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.set(key, JSON.stringify(body), 'EX', ttlSeconds).catch(console.error);
      return originalJson(body);
    };

    next();
  } catch (err) {
    next(err);
  }
};
