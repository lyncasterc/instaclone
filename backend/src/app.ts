import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongodbConnect from './mongo';
import config from './utils/config';
import userRouter from './routes/users';
import loginRouter from './routes/login';
import { errorHandler } from './utils/middleware';

const { NODE_ENV } = process.env;
const app = express();

if (NODE_ENV === 'development') {
  mongodbConnect(config.DEV_MONGODB_URI!);
}
app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);

app.use(errorHandler);
export default app;
