import { SessionOptions, CookieOptions } from 'express-session';
import env from '@utils/envalid';

const cookieConfig: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sessionConfig: SessionOptions = {
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: cookieConfig,
};

export default sessionConfig;
