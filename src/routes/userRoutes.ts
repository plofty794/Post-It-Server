import {
  changeAvatar,
  editProfile,
  getUserData,
  getYourProfile,
  refreshToken,
  requestEmailVerificationCode,
  requestPasswordResetCode,
  resetPassword,
  userLogin,
  userLogout,
  userSignUp,
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
import jwt from 'jsonwebtoken';

const router = Router();

router.get('/me', verifyUserSession, getYourProfile);
router.get('/user/:username', verifyUserSession, getUserData);
router.post('/login', loginRateLimit, validateData(userSignInSchema), userLogin);
router.post(
  '/password-reset-code',
  verificationCodeRequestLimiter,
  validateData(requestVerificationCodeSchema),
  requestPasswordResetCode
);
router.post('/reset-password', validateData(resetPasswordSchema), resetPassword);
router.post('/sign-up', validateData(userSignUpSchema), userSignUp);
router.post(
  '/verification-code',
  verificationCodeRequestLimiter,
  validateData(requestVerificationCodeSchema),
  requestEmailVerificationCode
);
router.post('/change-avatar', validateData(editProfilePicUrl), verifyUserSession, changeAvatar);
router.post('/refresh-token/:userID', refreshToken);
router.patch('/user/edit', validateData(editProfileSchema), verifyUserSession, editProfile);
router.delete('/logout', verifyUserSession, userLogout);

export default router;
