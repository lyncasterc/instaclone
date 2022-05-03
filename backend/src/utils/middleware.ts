import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from './logger';

export const authenticator = () => (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token;
  let decodedToken;
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    token = authorization.substring(7);
  }

  if (token) {
    decodedToken = jwt.verify(
      token,
      process.env.SECRET as string,
    ) as JwtPayload;
  }

  if (!token || !decodedToken || !decodedToken.id) {
    return res.status(401).send({
      error: 'token missing or invalid.',
    });
  }

  req.userToken = decodedToken;

  return next();
};

export const errorHandler = (error: Error, _req: Request, res: Response, next: NextFunction) => {
  const errorMessage = logger.getErrorMessage(error);

  if (process.env.NODE_ENV !== 'test') {
    logger.error(errorMessage);
  }

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).send({ error: errorMessage });
  }

  if (error.name === 'JsonWebTokenError') {
    return res.status(401).send({ error: 'invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).send({ error: 'token expired' });
  }

  return next(error);
};