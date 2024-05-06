import { Schema, model } from 'mongoose';

const passwordResetCodeSchema = new Schema({
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

const PasswordResetCodeSchema = model('PasswordResetCodes', passwordResetCodeSchema);

export default PasswordResetCodeSchema;
