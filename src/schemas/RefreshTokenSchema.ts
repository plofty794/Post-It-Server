import { Schema, model } from 'mongoose';

const refreshTokenSchema = new Schema(
  {
    refreshToken: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
  },
  { timestamps: true }
);

const RefreshTokenSchema = model('RefreshTokens', refreshTokenSchema);

export default RefreshTokenSchema;
