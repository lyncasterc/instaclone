import express from 'express';
import cors from 'cors';
import mongodbConnect from './mongo';
import config from './utils/config';

const { NODE_ENV } = process.env;
const app = express();

app.use(express.json());
app.use(express.static('build'));
app.use(cors());

if (NODE_ENV === 'development') {
  mongodbConnect(config.DEV_MONGODB_URI!);
}

export default app;
