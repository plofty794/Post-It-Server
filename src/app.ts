import { errorHandler } from '@middlewares/errorHandler';
import userRoutes from '@routes/userRoutes';
import postRoutes from '@routes/postRoutes';
import env from '@utils/envalid';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import commentRoutes from '@routes/commentRoutes';
import { sseStart } from '@utils/sseStart';

const app = express();

app.use(
  cors({
    origin: [env.DEV_CLIENT_URL, env.PROD_CLIENT_URL],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/new-notification', sseStart);
app.use('/api/v1', userRoutes);
app.use('/api/v1', postRoutes);
app.use('/api/v1', commentRoutes);

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
  .connect(env.MONGODB_COMPASS_URI)
  .then(() => {
    console.log('Connected to database');
    app.listen(env.PORT, () => {
      console.log(`Server running on port: ${env.PORT}`);
      console.log(`Server URL: http://localhost:${env.PORT}`);
    });
  })
  .catch(err => console.error(err));
