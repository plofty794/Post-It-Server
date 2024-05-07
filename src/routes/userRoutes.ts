import {
  changeAvatar,
  editProfile,
  getUserData,
  getYourProfile,
  logOut,
  requestEmailVerificationCode,
  requestPasswordResetCode,
  resetPassword,
  userSignUp,
} from '@controllers/userControllers';
import { loginRateLimit, verificationCodeRequestLimiter } from '@middlewares/rateLimiters';
import { passportAuthenticate, validateData } from '@middlewares/validationMiddleware';
import { Router } from 'express';
import {
  editProfilePicUrl,
  editProfileSchema,
  requestVerificationCodeSchema,
  resetPasswordSchema,
  userSignInSchema,
  userSignUpSchema,
} from '@validation/schemas';
import passport from 'passport';
import { verifyUserSession } from '@middlewares/verifyUserSession';

const router = Router();

router.get('/me', verifyUserSession, getYourProfile);
router.get('/user/:username', verifyUserSession, getUserData);
router.post('/login', loginRateLimit, validateData(userSignInSchema), passportAuthenticate(passport), (req, res) => {
  const randomId = crypto.randomUUID();
  res.status(200).json({ token: `${req.session.passport.user}-${randomId}` });
});
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
router.post('/logout', logOut);
router.patch('/user/edit', validateData(editProfileSchema), verifyUserSession, editProfile);
export default router;
