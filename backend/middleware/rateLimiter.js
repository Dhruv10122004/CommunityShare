const { rateLimit, MemoryStore } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { redis, redisReady } = require('../config/redisConfig');

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
};

const createLimiter = async ({
  windowMs = 60 * 1000,
  max = 10,
  message = 'Too many requests, try again later.',
} = {}) => {
  if (!process.env.REDIS_URL || !redis) {
    return rateLimit({
      windowMs,
      max,
      standardHeaders: true,
      legacyHeaders: false,
      keyGenerator: getClientIp,
      message: { message },
      store: new MemoryStore(),
    });
  }

  await redisReady;

  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getClientIp,
    message: { message },
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
    }),
  });
};

const createAsyncLimiter = (options) => async (req, res, next) => {
  try {
    const limiter = await createLimiter(options);
    return limiter(req, res, next);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authLimiter: createAsyncLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again in a minute.',
  }),
  messageLimiter: createAsyncLimiter({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many message requests. Please slow down.',
  }),
  bookingLimiter: createAsyncLimiter({
    windowMs: 60 * 1000,
    max: 15,
    message: 'Too many booking requests. Please wait a moment.',
  }),
};
