import { Schema, model } from 'mongoose';

const emailVerificationCodeSchema = new Schema({
  verificationCode: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, expires: '10m' },
});

const EmailVerificationCodeSchema = model('EmailVerificationCodes', emailVerificationCodeSchema);

export default EmailVerificationCodeSchema;
