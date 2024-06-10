import {
  changeAvatar,
  editProfile,
  getUserData,
  getYourNotifications,
  getYourProfile,
  refreshToken,
  requestEmailVerificationCode,
  requestPasswordResetCode,
  resetPassword,
  userLogin,
  userLogout,
  userSignUp,
  readNotification,
} from '@controllers/userControllers';
import { loginRateLimit, verificationCodeRequestLimiter } from '@middlewares/rateLimiters';
import { validateData } from '@middlewares/validationMiddleware';
import { Router } from 'express';
import {
  editProfilePicUrl,
  editProfileSchema,
  requestVerificationCodeSchema,
  resetPasswordSchema,
  userSignInSchema,
  userSignUpSchema,
} from '@validation/schemas';
import { verifyUserSession } from '@middlewares/verifyUserSession';

const router = Router();

router.get('/users/me', verifyUserSession, getYourProfile);
router.get('/users/user/:username', verifyUserSession, getUserData);
router.get('/users/user/notifications/:page', verifyUserSession, getYourNotifications);
router.post('/users/login', loginRateLimit, validateData(userSignInSchema), userLogin);
router.post(
  '/users/password-reset-code',
  verificationCodeRequestLimiter,
  validateData(requestVerificationCodeSchema),
  requestPasswordResetCode
);
router.post('/users/reset-password', validateData(resetPasswordSchema), resetPassword);
router.post('/users/sign-up', validateData(userSignUpSchema), userSignUp);
router.post(
  '/users/verification-code',
  verificationCodeRequestLimiter,
  validateData(requestVerificationCodeSchema),
  requestEmailVerificationCode
);
router.post('/users/change-avatar', validateData(editProfilePicUrl), verifyUserSession, changeAvatar);
router.post('/users/refresh-token/:userID', refreshToken);
router.patch('/users/user/edit', validateData(editProfileSchema), verifyUserSession, editProfile);
router.patch('/users/user/read-notification/:notificationID', verifyUserSession, readNotification);
router.delete('/users/logout', verifyUserSession, userLogout);

export default router;
