import Users from '@models/Users';
import { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';

export const verifyUserSession = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (req.isAuthenticated() && token != null) {
    const verified = await verifyToken(token);

    if (!verified)
      return req.logOut(error => {
        if (error) throw error;
        res.sendStatus(401);
      });
    return next();
  }

  req.logOut(error => {
    if (error) throw error;
    res.sendStatus(401);
  });
};

async function verifyToken(token: string) {
  const userID = token.split('-')[0];

  if (isValidObjectId(userID)) {
    const user = await Users.getUser(undefined, userID);
    return user ? true : false;
  }
  return false;
}
