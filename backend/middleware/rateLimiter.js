const { rateLimit } = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const redis = require('../config/redisConfig');

const getClientIp = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0] || req.ip || 'unknown';
};

const getRateLimitStore = () => {
  if (!process.env.REDIS_URL || !redis) {
    return undefined;
  }

  return new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  });
};

const createLimiter = ({
  windowMs = 60 * 1000,
  max = 10,
  message = 'Too many requests, try again later.',
} = {}) =>
  rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: getClientIp,
    message: { message },
    store: getRateLimitStore(),
  });

module.exports = {
  authLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 5,
    message: 'Too many login attempts. Please try again in a minute.',
  }),
  messageLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 20,
    message: 'Too many message requests. Please slow down.',
  }),
  bookingLimiter: createLimiter({
    windowMs: 60 * 1000,
    max: 15,
    message: 'Too many booking requests. Please wait a moment.',
  }),
};
