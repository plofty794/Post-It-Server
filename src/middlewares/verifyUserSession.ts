import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';
import jwt, { JsonWebTokenError, Jwt } from 'jsonwebtoken';
import env from '@utils/envalid';

export const verifyUserSession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1].split('~')[0];
  try {
    if (!token) {
      throw createHttpError(401, 'Access Denied: No token provided');
    }
    const tokenDetails = jwt.verify(token, env.ACCESS_TOKEN_PRIVATE) as Jwt;
    req.user = tokenDetails.payload;
    next();
  } catch (error) {
    const err = error as JsonWebTokenError;
    res.status(403).json({
      message: err.message,
    });
  }
};
