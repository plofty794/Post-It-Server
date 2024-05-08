import RefreshTokenSchema from '@schemas/RefreshTokenSchema';
import jwt, { JsonWebTokenError, Jwt } from 'jsonwebtoken';
import env from '@utils/envalid';

export default {
  generateRefreshToken: async (payload: string) => {
    try {
      const refreshTokenExist = await RefreshTokenSchema.findOne({
        user: payload,
      });

      if (refreshTokenExist) {
        await refreshTokenExist.deleteOne();
      }
      const token = jwt.sign({ payload }, env.REFRESH_TOKEN_PRIVATE, {
        expiresIn: '7d',
      });

      const refreshToken = await RefreshTokenSchema.create({
        user: payload,
        refreshToken: token,
      });

      return refreshToken;
    } catch (error) {
      return error as JsonWebTokenError;
    }
  },

  refreshAccessToken: async (userID: string) => {
    try {
      const activeRefreshToken = await RefreshTokenSchema.findOne({ user: userID });
      if (!activeRefreshToken) {
        throw new Error('Session expired. Please log in again.');
      }

      jwt.verify(activeRefreshToken.refreshToken, env.REFRESH_TOKEN_PRIVATE) as Jwt;

      const accessToken = jwt.sign({ payload: userID }, env.ACCESS_TOKEN_PRIVATE, {
        expiresIn: '15m',
      });

      return { accessToken: `${accessToken}~${userID}` };
    } catch (error) {
      if ((error as JsonWebTokenError).message === 'jwt expired') {
        await RefreshTokenSchema.findOneAndDelete({ user: userID });
      }
      return error as Error;
    }
  },

  removeRefreshToken: async (userID: string) => {
    try {
      const tokenExist = await RefreshTokenSchema.findOne({
        user: userID,
      });

      if (!tokenExist) {
        throw new Error('Token not found.');
      }

      await RefreshTokenSchema.findOneAndDelete({ user: userID });

      return true;
    } catch (error) {
      return error as Error;
    }
  },
};
