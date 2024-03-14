import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import logger from '../utils/logger';

let mongodbServer: MongoMemoryServer;

const connect = async () => {
  mongodbServer = await MongoMemoryServer.create();
  const testMongoDBURI = mongodbServer.getUri();

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(testMongoDBURI);
      logger.info('Connected to TEST MongoDB');
    }
  } catch (error) {
    const message = logger.getErrorMessage(error);
    logger.error('Error connecting to test MongoDB: ', message);
  }
};

const close = async () => {
  await mongoose.disconnect();
  await mongodbServer.stop();
};

const clear = async () => {
  const { collections } = mongoose.connection;
  Object.keys(collections).forEach((key) => collections[key].deleteMany({}));
};

export default {
  connect,
  close,
  clear,
};
