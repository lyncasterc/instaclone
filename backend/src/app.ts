import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongodbConnect, { testMongodb } from './mongo';
import config from './utils/config';
import postRouter from './routes/posts';
import userRouter from './routes/users';
import authRouter from './routes/auth';
import testRouter from './routes/tests';
import likeRouter from './routes/likes';
import { errorHandler, logErrorCodes } from './utils/middleware';

const { NODE_ENV } = process.env;
const app = express();

if (NODE_ENV === 'development') {
  mongodbConnect(config.DEV_MONGODB_URI!);
} else if (NODE_ENV === 'cypress') {
  (async () => {
    await testMongodb.connect();
  })();
}

app.use(logErrorCodes);

app.get('/health', (_req, res) => {
  res.send('ok');
});

app.use(cookieParser());
app.use(cors());
app.use(express.static('build'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

app.use('/api/posts', postRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/likes', likeRouter);

if (NODE_ENV !== 'production') {
  app.use('/api/test', testRouter);
}

app.use(errorHandler);
export default app;
