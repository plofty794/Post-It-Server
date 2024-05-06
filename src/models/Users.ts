import UserSchema from '@schemas/UserSchema';
import EmailVerificationCodes from './EmailVerificationCodes';
import EmailVerificationCodeSchema from '@schemas/EmailVerificationCodeSchema';
import PasswordResetCodeSchema from '@schemas/PasswordResetCodeSchema';
import PasswordResetCodes from './PasswordResetCodes';

export default {
  requestEmailVerificationCode: async function (email: string) {
    try {
      const existingEmail = await UserSchema.findOne({ email });

      if (existingEmail) {
        throw new Error('A user with this email address already exists.');
      }

      const hasExistingVerificationCodes = await EmailVerificationCodeSchema.find({ userEmail: email });

      if (hasExistingVerificationCodes.length > 0) {
        await EmailVerificationCodeSchema.deleteMany({
          userEmail: {
            $in: hasExistingVerificationCodes.map(v => v.userEmail),
          },
        });
      }

      const verificationCode = await EmailVerificationCodes.generateVerificationCode(email);

      return { verificationCode: verificationCode.verificationCode, userEmail: verificationCode.userEmail };
    } catch (error) {
      return error as Error;
    }
  },

  requestPasswordResetCode: async function (email: string) {
    try {
      const user = await UserSchema.findOne({ email });

      if (!user) {
        throw new Error("A user with this email doesn't exist. Please sign up instead.");
      }

      const hasExistingPasswordResetCodes = await PasswordResetCodeSchema.find({ userEmail: email });

      if (hasExistingPasswordResetCodes.length > 0) {
        await EmailVerificationCodeSchema.deleteMany({
          userEmail: {
            $in: hasExistingPasswordResetCodes.map(v => v.userEmail),
          },
        });
      }

      const passwordResetCode = await PasswordResetCodes.generatePasswordResetCode(email);

      return { passwordResetCode: passwordResetCode.verificationCode, userEmail: passwordResetCode.userEmail };
    } catch (error) {
      return error as Error;
    }
  },

  signUp: async function ({ username, email, password, verificationCode, firstName, lastName }: TSignUp) {
    try {
      const existingEmail = await UserSchema.findOne({ email });

      if (existingEmail) {
        throw new Error('A user with this email address already exists.');
      }

      const existingUsername = await UserSchema.findOne({ username });

      if (existingUsername) {
        throw new Error('A user with this username already exists.');
      }

      const emailVerificationToken = await EmailVerificationCodes.get({ email, verificationCode });

      if (!emailVerificationToken) {
        throw new Error('Verification code incorrect or expired.');
      } else {
        await emailVerificationToken.deleteOne();
      }

      await UserSchema.create({
        firstName,
        lastName,
        username,
        email,
        password,
      });

      return { message: 'You can now proceed to login.' };
    } catch (error) {
      return error as Error;
    }
  },

  resetPassword: async function ({ email, password, verificationCode }: TPasswordReset) {
    try {
      const existingUser = await UserSchema.findOne({ email }).select('+email').exec();

      if (!existingUser) {
        throw new Error('User not found');
      }

      const passwordResetToken = await PasswordResetCodeSchema.findOne({ userEmail: email, verificationCode }).exec();

      if (!passwordResetToken) {
        throw new Error('Password reset code incorrect or expired.');
      } else {
        await passwordResetToken.deleteOne();
      }

      existingUser.password = password;

      await existingUser.save();

      return existingUser;
    } catch (error) {
      return error as Error;
    }
  },

  getUser: async function (email?: string, id?: string, username?: string) {
    if (id) {
      const user = await UserSchema.findById(id).select('-password').populate('savedPosts').exec();
      return user;
    }
    if (username) {
      const user = await UserSchema.findOne({ username }).select('-password').populate('savedPosts').exec();
      return user;
    }
    const user = await UserSchema.findOne({ email }).select('email password').exec();
    return user;
  },

  editProfile: async (userID: string, reqBody: Record<string, any>) => {
    try {
      const user = await UserSchema.findById(userID);

      if (!user) {
        throw new Error('No user found.');
      }

      await UserSchema.findByIdAndUpdate(userID, {
        ...reqBody,
      });

      return { message: 'Your profile has been edited.' };
    } catch (error) {
      return error as Error;
    }
  },

  changeAvatar: async (userID: string, reqBody: Record<string, any>) => {
    try {
      const user = await UserSchema.findById(userID);

      if (!user) {
        throw new Error('No user found.');
      }

      await UserSchema.findByIdAndUpdate(userID, {
        ...reqBody,
      });

      return { message: 'Your avatar has been edited.' };
    } catch (error) {
      return error as Error;
    }
  },
};

type TSignUp = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  verificationCode: string;
};

type TPasswordReset = Pick<TSignUp, 'email' | 'password' | 'verificationCode'>;
