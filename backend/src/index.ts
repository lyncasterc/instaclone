import express from 'express';
import cors from 'cors';
import mongo from './mongo';
import config from './utils/config';
import logger from './utils/logger';

const { NODE_ENV } = process.env;
const app = express();
app.use(express.json());
app.use(express.static('build'));
app.use(cors());

if (NODE_ENV === 'development') {
  mongo.connect(config.DEV_MONGODB_URI!);
}

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
