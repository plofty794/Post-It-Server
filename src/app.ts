import { errorHandler } from '@middlewares/errorHandler';
import userRoutes from '@routes/userRoutes';
import postRoutes from '@routes/postRoutes';
import env from '@utils/envalid';
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import sessionConfig from '@config/sessionConfig';
import passport from 'passport';
import cors from 'cors';
import '@config/passport';

const app = express();

app.use(
  cors({
    origin: [env.DEV_CLIENT_URL, env.PROD_CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1', userRoutes);
app.use('/api/v1', postRoutes);

app.get('/', async (req, res) => {
  res.json({
    message: 'Hello world!',
  });
});

app.use((_, res) => {
  res.status(404).json({
    message: 'Endpoint not found.',
  });
});
app.use(errorHandler);

mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    console.log('Connected to database');
    app.listen(env.PORT, () => {
      console.log(`Server running on port: ${env.PORT}`);
      console.log(`Server URL: http://localhost:${env.PORT}`);
    });
  })
  .catch(err => console.error(err));
