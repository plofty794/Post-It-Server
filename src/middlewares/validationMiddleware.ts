import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { PassportStatic } from 'passport';
import { z } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function passportAuthenticate(passport: PassportStatic) {
  return (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function (err: any, user: Express.User) {
      try {
        if (err) {
          throw createHttpError(400, (err as Error).message);
        }
        if (!user) {
          throw createHttpError(400, (err as Error).message);
        }
        req.logIn(user, function (err) {
          if (err) {
            throw err;
          }
          next();
        });
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
}
