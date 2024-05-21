import RefreshToken from '@models/RefreshToken';
import Users from '@models/Users';
import { eventEmitter } from '@utils/events/events';
import createHttpError from 'http-errors';
import { NextFunction, Request, Response } from 'express';
import Notifications from '@models/Notifications';

export const getYourProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const user = await Users.getUser(undefined, req.user);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getUserData = async (req: Request, res: Response, next: NextFunction) => {
  const { username } = req.params;
  try {
    const user = await Users.getUser(undefined, undefined, username);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const getYourNotifications = async (req: Request, res: Response, next: NextFunction) => {
  const page = Number(req.params.page) ?? 1;
  const limit = 10;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const notifications = await Notifications.getNotifications(req.user, page, limit);
    if (notifications instanceof Error) {
      throw createHttpError(400, notifications.message);
    } else {
      res.status(200).json({ notifications });
    }
  } catch (error) {
    next(error);
  }
};

export const readNotification = async (req: Request, res: Response, next: NextFunction) => {
  const { notificationID } = req.params;
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const result = await Notifications.readNotification(req.user, notificationID);
    if (result instanceof Error) {
      throw createHttpError(400, result.message);
    } else {
      res.status(200).json({ result });
    }
  } catch (error) {
    next(error);
  }
};

export const editProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const editedUserProfile = await Users.editProfile(req.user, req.body);
    if (editedUserProfile instanceof Error) {
      throw createHttpError(400, editedUserProfile.message);
    } else {
      res.status(200).json({ message: editedUserProfile.message });
    }
  } catch (error) {
    next(error);
  }
};

export const changeAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (typeof req.user === 'undefined') {
      throw createHttpError(400, 'This resource requires a logged in user.');
    }
    const editedUserAvatar = await Users.changeAvatar(req.user, req.body);
    if (editedUserAvatar instanceof Error) {
      throw createHttpError(400, editedUserAvatar.message);
    } else {
      res.status(200).json({ message: editedUserAvatar.message });
    }
  } catch (error) {
    next(error);
  }
};

export const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
  const { username, firstName, lastName, email, password, verificationCode } = req.body;
  try {
    const newUser = await Users.signUp({ firstName, lastName, username, email, password, verificationCode });
    if (newUser instanceof Error) {
      throw createHttpError(400, newUser.message);
    } else {
      res.status(201).json({ message: newUser.message });
    }
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const token = await Users.logIn(email, password);
    if (token instanceof Error) {
      throw createHttpError(400, token.message);
    } else {
      res.status(200).json({ token: token.accessToken });
    }
  } catch (error) {
    next(error);
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = await Users.logOut(req.user);
    if (token instanceof Error) {
      throw createHttpError(400, token.message);
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const { userID } = req.params;
  try {
    const accessToken = await RefreshToken.refreshAccessToken(userID);

    if (accessToken instanceof Error) {
      throw createHttpError(401, accessToken.message);
    } else {
      res.status(200).json({ accessToken: accessToken?.accessToken });
    }
  } catch (error) {
    next(error);
  }
};

export const requestEmailVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  try {
    const verificationCode = await Users.requestEmailVerificationCode(email);

    if (verificationCode instanceof Error) {
      throw createHttpError(409, verificationCode.message);
    } else {
      eventEmitter.emit('requestVerificationCode', verificationCode.userEmail, verificationCode.verificationCode);
      res.status(201).json({ message: 'Verification code has been sent.' });
    }
  } catch (error) {
    next(error);
  }
};

export const requestPasswordResetCode = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const verificationCode = await Users.requestPasswordResetCode(email);

    if (verificationCode instanceof Error) {
      throw createHttpError(409, verificationCode.message);
    } else {
      eventEmitter.emit('requestPasswordResetCode', verificationCode.userEmail, verificationCode.passwordResetCode);

      res.status(201).json({ message: 'Password reset code has been sent.' });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password, verificationCode } = req.body;
  try {
    const user = await Users.resetPassword({ email, password, verificationCode });

    if (user instanceof Error) {
      throw createHttpError(409, user.message);
    } else {
      eventEmitter.emit('passwordResetSuccess', user.email);

      res.status(200).json({ message: 'Password has been reset. You can log in again.' });
    }
  } catch (error) {
    next(error);
  }
};
