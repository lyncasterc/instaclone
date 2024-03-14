/* eslint-disable import/no-cycle */
import mongoose from 'mongoose';
import logger from '../utils/logger';

const connect = async (uri: string) => {
  try {
    await mongoose.connect(uri);
    logger.info('Connected to: ', uri);
  } catch (error) {
    const message = logger.getErrorMessage(error);
    logger.error('Error connecting to dev MongoDB: ', message);
  }
};

export default connect;
export { default as User } from './models/user';
export { default as Post } from './models/post';
export { default as Comment } from './models/comment';
export { default as testMongodb } from './test-mongodb';
