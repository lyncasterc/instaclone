import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import express from 'express';
import fieldParsers from '../utils/field-parsers';
import logger from '../utils/logger';
import { User } from '../mongo';
import config from '../utils/config';

const router = express.Router();
const { JWT_SECRET } = config;

router.post('/login', async (req, res) => {
  if (!JWT_SECRET) {
    return res.status(500).send({ error: 'JWT_SECRET is not set.' });
  }

  const { body } = req;
  let loginFields: {
    username: string,
    password: string,
  };

  try {
    loginFields = fieldParsers.proofLogInFields(body);
  } catch (error) {
    return res.status(400).send({ error: logger.getErrorMessage(error) });
  }

  try {
    const user = await User.findOne({ username: loginFields.username });
    const isUserValidated = !user
      ? false
      : await bcrypt.compare(loginFields.password, user.passwordHash);

    if (!isUserValidated) {
      return res.status(401).send({
        error: 'Invalid username or password.',
      });
    }

    const userTokenInfo = {
      username: user.username,
      id: user.id,
    };

    const accessToken = jwt.sign(
      userTokenInfo,
      JWT_SECRET,
      // { expiresIn: 60 * 5 }, // 5 minutes
      { expiresIn: 5 },
    );
    const refreshToken = jwt.sign(
      userTokenInfo,
      JWT_SECRET,
      { expiresIn: '30d' },
    );

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).send({ accessToken, username: user.username });
  } catch (error) {
    return res.status(500).send({ error: 'Something went wrong!' });
  }
});

router.post('/refresh', async (req, res, next) => {
  if (!JWT_SECRET) {
    return res.status(500).send({ error: 'JWT_SECRET is not set.' });
  }

  let decodedRefreshToken;
  const { refreshToken } = req.cookies;

  if (refreshToken) {
    try {
      decodedRefreshToken = jwt.verify(
        refreshToken,
        JWT_SECRET,
      ) as jwt.JwtPayload;
    } catch (error) {
      return next(error);
    }
  }

  if (
    !decodedRefreshToken
    || !decodedRefreshToken.id
    || !decodedRefreshToken.username
  ) {
    return res.status(401).send({
      error: 'refresh token missing or invalid.',
    });
  }

  // generate new access token
  const userTokenInfo = {
    username: decodedRefreshToken.username,
    id: decodedRefreshToken.id,
  };

  const newAccessToken = jwt.sign(
    userTokenInfo,
    JWT_SECRET,
    // { expiresIn: 60 * 5 }, // 5 minutes
    { expiresIn: 5 },
  );

  return res.status(200).send({ accessToken: newAccessToken });
});

router.post('/logout', (_req, res) => {
  res.clearCookie('refreshToken');
  res.status(204).end();
});

export default router;
