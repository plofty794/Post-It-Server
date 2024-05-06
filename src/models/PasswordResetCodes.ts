import PasswordResetCodeSchema from '@schemas/PasswordResetCodeSchema';
import otpGenerator from 'otp-generator';

export default {
  generatePasswordResetCode: async function (email: string) {
    const verificationCode = otpGenerator.generate(8, { upperCaseAlphabets: false, specialChars: false });
    const passwordResetCode = await PasswordResetCodeSchema.create({
      userEmail: email,
      verificationCode,
    });

    return passwordResetCode;
  },
};
