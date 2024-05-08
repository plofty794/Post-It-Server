import jwt from 'jsonwebtoken';
import env from './envalid';

export function verifyToken(accessToken: string) {
  try {
    const tokenDetails = jwt.verify(accessToken, env.ACCESS_TOKEN_PRIVATE);
    return tokenDetails;
  } catch (err) {
    return new Error('Access Denied: Invalid token');
  }
}
