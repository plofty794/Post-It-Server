import { rateLimit } from 'express-rate-limit';

export const verificationCodeRequestLimiter = rateLimit({
  windowMs: 60000 * 5,
  limit: 3,
  message: {
    error: 'Too many requests, please wait after 5 minutes and try again.',
  },
  validate: { xForwardedForHeader: false },
});

export const loginRateLimit = rateLimit({
  windowMs: 60000 * 5,
  max: 10,
  message: {
    error: 'Too many requests, please wait after 5 minutes and try again.',
  },
  validate: { xForwardedForHeader: false },
});
