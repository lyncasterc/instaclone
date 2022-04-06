import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const tokenExtractor = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.token = authorization.substring(7);
  }
  next();
};

const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test') {
    logger.error(error.message);
  }

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).send({ error: 'token expired' });
  }

  return next(error);
};

export default {
  tokenExtractor,
  errorHandler,
};
