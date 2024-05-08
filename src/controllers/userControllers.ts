import RefreshToken from '@models/RefreshToken';
import Users from '@models/Users';
import { eventEmitter } from '@utils/events/events';
import { RequestHandler } from 'express';
import createHttpError from 'http-errors';

export const getYourProfile: RequestHandler = async (req, res, next) => {
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

export const getUserData: RequestHandler = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await Users.getUser(undefined, undefined, username);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const editProfile: RequestHandler = async (req, res, next) => {
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

export const changeAvatar: RequestHandler = async (req, res, next) => {
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

export const userSignUp: RequestHandler = async (req, res, next) => {
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

export const userLogin: RequestHandler = async (req, res, next) => {
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

export const userLogout: RequestHandler = async (req, res, next) => {
  const { userID } = req.params;
  try {
    const token = await Users.logOut(userID);
    if (token instanceof Error) {
      throw createHttpError(400, token.message);
    } else {
      res.sendStatus(200);
    }
  } catch (error) {
    next(error);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
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

export const requestEmailVerificationCode: RequestHandler = async (req, res, next) => {
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

export const requestPasswordResetCode: RequestHandler = async (req, res, next) => {
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

export const resetPassword: RequestHandler = async (req, res, next) => {
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
