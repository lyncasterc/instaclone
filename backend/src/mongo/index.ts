import mongoose from 'mongoose';
import logger from '../utils/logger';
import user from './models/user';
import post from './models/post';
import comment from './models/comment';

const connect = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    logger.info('Connected to: ', uri);
  } catch (error) {
    const message = logger.getErrorMessage(error);
    logger.error('Error connecting to dev MongoDB: ', message);
  }
};

export default {
  connect,
  user,
  post,
  comment,
};
