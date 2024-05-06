import { rateLimit } from 'express-rate-limit';

export const verificationCodeRequestLimiter = rateLimit({
  windowMs: 60000 * 5,
  limit: 3,
  message: {
    error: 'Too many requests, please wait after 5 minutes and try again.',
  },
});

export const loginRateLimit = rateLimit({
  windowMs: 3 * 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});
