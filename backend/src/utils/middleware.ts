import { Request, Response, NextFunction } from 'express';

const tokenExtractor = (req: Request, _res: Response, next: NextFunction) => {
  const authorization = req.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.token = authorization.substring(7);
  }
  next();
};

export default {
  tokenExtractor,
};
