import EmailVerificationCodeSchema from '@schemas/EmailVerificationCodeSchema';
import otpGenerator from 'otp-generator';

export default {
  generateVerificationCode: async function (email: string) {
    const verificationCode = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    const emailVerificationCode = await EmailVerificationCodeSchema.create({
      userEmail: email,
      verificationCode,
    });

    return emailVerificationCode;
  },

  getAll: async function () {
    const emailVerificationCodes = await EmailVerificationCodeSchema.find();
    return emailVerificationCodes;
  },

  get: async function ({ email, verificationCode }: { email: string; verificationCode: string }) {
    const emailVerificationCode = await EmailVerificationCodeSchema.findOne({ userEmail: email, verificationCode });
    return emailVerificationCode;
  },

  remove: async function (_id: string) {
    await EmailVerificationCodeSchema.findByIdAndDelete(_id);
    return { message: 'Verification code has been removed.' };
  },
};
