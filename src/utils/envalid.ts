import { cleanEnv, email, num, port, str, url } from 'envalid';
import { config } from 'dotenv';

config();

export default cleanEnv(process.env, {
  PORT: port(),
  MONGODB_URI: url(),
  ROUNDS: num(),
  SESSION_SECRET: str(),
  DEV_CLIENT_URL: url(),
  PROD_CLIENT_URL: url(),
  SERVICE_EMAIL: email(),
  APP_PASSWORD: str(),
});
